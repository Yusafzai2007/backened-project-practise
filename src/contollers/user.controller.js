import { asynchandler } from "../utils/asynchandler.js";
import {apierror} from "../utils/api.error.js"
import {User} from "../models/user.model.js"
import {uploadcloudinary} from "../utils/cloudinary.js"
import {apiresponse}from "../utils/api.response.js"


   const generaterefrenceToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken }; // ✅ fixed
  } catch (error) {
    throw new apierror(500, "something went wrong while generating access token");
  }
};


















const requesthandler = asynchandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  console.log(username, email, fullname,password);
  
   if (
       [username,email,fullname,password].some((field)=>
      field?.trim() ===""
      )
   ) {
        throw new apierror(400,"All filed are required")
   }


   const existuser= await User.findOne({
     $or:[{username},{email}]
   })

  if (existuser) {
    if (existuser.username === username) {
      throw new apierror(410,"username already exist")
    }else if (existuser.email === email) {
      throw new apierror(409,"email already exist")
    }
   
  }





   const loaclpath=req.files?.avatar[0]?.path;
   const localimg=req.files?.coverimg[0]?.path;

    if (!loaclpath) {
      throw new apierror(400,"avatar is required")
    }

    const avatar= await uploadcloudinary(loaclpath);
    const coverimg=await uploadcloudinary(localimg)
    
    if (!avatar) {
            throw new apierror(400,"avatar is required")
    }
   
  const user = await User.create({
      fullname,
      avatar:avatar.url,
      coverimg:coverimg?.url||"",
      email,
      password,
      username:username.toLowerCase()
    })


   const createUser= await User.findById(user._id).select(
    "-password -refreshToken"
   )

    if (!createUser) {
      throw new apierror(500,"something went wrong")
    }

    return res.status(201).json(
      new apiresponse(200,createUser,"user successfull registered")
    )

});



const loggedinuser=asynchandler(async(req,res)=>{

  const {email,username,password}=req.body
   
  if (!username && !email) {
     throw new apierror(400,"username and email is required")  //empty to nahi a rha ha 
  }


   const user=await User.findOne({    //check karna ha ya ni
    $or:[{username},{email}]
   })

    if (!user) {
      throw new apierror(404,"user does not exist")
    }

    const passwordcheck=await user.isPasswordCorrect(password)


    if (!passwordcheck) {
      throw new apierror(401,"password does not exist")
    }

    const{accesstoken,refreshtoken}=  await generaterefrenceToken(user._id)
  console.log("Access Token:", accesstoken);
  console.log("Refresh Token:", refreshtoken);
    const loginuser=await User.findById(user._id).select("-password -refreshToken")

      const options={
        httpOnly:true,
        secure:false
      }

   return res
   .status(200)
   .cookie("accesstoken",accesstoken,options)
   .cookie("refreshtoken",refreshtoken,options)
   .json(
    new apiresponse(
      200,
      {
        user:loginuser,accesstoken,refreshtoken
      },
      "user loggedin succesfully"
    )
   )




})



const logoutuser=asynchandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshtoken:undefined
      },
    },
    {
      new:true
    }
  )
   const option={
        httpOnly:true,
        secure:true
      }
      return res
      .status(200)
      .clearCookie("accesstoken",option)
      .clearCookie("refreshtoken",option)
      .json(new apiresponse(200,{},"user logged out"))





})














export {
   requesthandler, 
   loggedinuser,
   logoutuser
  };
