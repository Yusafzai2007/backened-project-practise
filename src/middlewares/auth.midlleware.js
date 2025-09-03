import { apierror } from "../utils/api.error.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const jwtverify=asynchandler(async(req,_,next)=>{
   try {
     const token=req.cookies?.accesstoken||
     req.header('Authnetication')?.replace('bearer',"")
 
 
     if (!token) {
         throw new apierror(401,"unautorized request")
     }
 
   const decodetoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user=await User.findById(decodetoken?._id).select("-passowrd -refreshToken")
 
    if (!user) {
     throw new apierror(401,"invalid acess token")
    }
   
    req.user=user;
    next()
 
   } catch (error) {
       throw new apierror(401,error?.message|| "invalid acess token")
   }
})

















































