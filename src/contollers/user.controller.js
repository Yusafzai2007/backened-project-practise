import { asynchandler } from "../utils/asynchandler.js";
import {apierror} from "../utils/api.error.js"
import {User} from "../routes/user.routes.js"
import {uploadcloudinary} from "../utils/cloudinary.js"
import {apiresponse}from "../utils/api.response.js"
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


   const existuser=User.findOne({
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
   
  const user = await User.Create({
      fullname,
      avatar:avatar.url,
      coverimg:coverimg?.url||"",
      email,
      password,
      username:username.toLowerCase()
    })


   const createUser= await User.findId(user._id).select(
    "-password -refreshToken"
   )

    if (!createUser) {
      throw new apierror(500,"something went wrong")
    }

    return res.status(201).json(
      new apiresponse(200,createUser,"user successfull registered")
    )
  console.log("📩 Incoming request body:", req.body);

});


export { requesthandler };
