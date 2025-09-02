import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectdb=async()=>{
    try {
      const intsanceawait=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
      console.log(`/n MongoDB connected !! DB Host:${intsanceawait.connection.host}`);
      
    } catch (error) {
        console.log(`Error while connecting to db ${error.message}`);
        process.exit(1)
    }
}


export default connectdb 