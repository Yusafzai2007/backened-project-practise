import { Router } from "express";
import { requesthandler } from "../contollers/user.controller.js"; 
import  {upload} from "../middlewares/multer.middleware.js"
const router = Router();

router.post("/register",
     upload.fields([
       {
          name:'avatar',
          maxCount:1
       },
       {
        name:'coverimg',
        maxCount:1
       }
     ]),
    requesthandler);
console.log("✅ user.routes.js loaded");

export default router;
