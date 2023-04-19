import express from "express";
import {
  add_user,
  delete_restore_user,
  getalluser,
  update_user,
  user_search,
  user_signup,
  user_otp_verify,
  user_login,
  user_details,
  change_user_password,
  user_forgate_password,
  admin_login
} from "../controllers/userController.js";
import { auth_user, fetch_user, admin_auth } from '../../middleware/auth.js'

const userRouter = express.Router();

userRouter.post("/add_user", add_user);
userRouter.get("/all_user", getalluser);
userRouter.get("/user_search", user_search);

userRouter.post("/user_signup", user_signup);
userRouter.post("/user_otp_verify", user_otp_verify);
userRouter.post("/user_login", user_login);
// userRouter.post("/user_profile_update", user_profile_update);
userRouter.put("/update_user", auth_user, update_user);
userRouter.put("/delete_restore_user", admin_auth, delete_restore_user);
userRouter.post("/user_search", admin_auth, user_search);
userRouter.get("/user_details", auth_user, user_details);
userRouter.post("/change_user_password", change_user_password);
userRouter.post("/user_forgate_password", user_forgate_password);

userRouter.post("/admin_login", admin_login);



export default userRouter;
