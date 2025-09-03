import { Router } from "express";
import { loggedinuser, logoutuser, requesthandler } from "../contollers/user.controller.js"; 
import  {upload} from "../middlewares/multer.middleware.js"
import { jwtverify } from "../middlewares/auth.midlleware.js";
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

router.route("/login").post(loggedinuser)
router.route("/logout").post(jwtverify,logoutuser)














console.log("✅ user.routes.js loaded");









export default router;
