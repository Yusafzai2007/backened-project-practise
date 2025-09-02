import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
const app=express()


app.use(cors({
    origin:process.env.PORT.CORS_ORIGN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())



      // import router

 import userRoute from "./routes/user.routes.js"
 app.use("/api/v1/users",userRoute)
//http:localhost:8000/api/v1/users/register


export{ app }