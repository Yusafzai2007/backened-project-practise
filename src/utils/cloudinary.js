
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    
})

const uploadcloudinary=async(loaclfilepath)=>{
    try {
        if (!loaclfilepath) return null;
        //upload to cloudinary
     const response=await cloudinary.uploader.upload(loaclfilepath,{
            resource_type:"auto",

        })
        //fieles upload successfully
        console.log("file uploaded successfully",response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(loaclfilepath)
        return null;
    }
}

export{uploadcloudinary};















