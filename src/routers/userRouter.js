import express from "express";
import {
  add_user,
  delete_user,
  getalluser,
  update_user,
  userByid,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/add_user", add_user);
userRouter.get("/all_user", getalluser);
userRouter.get("/all_user/:id", userByid);
userRouter.put("/update_user/:id", update_user);
userRouter.delete("/delete_user/:id", delete_user);
export default userRouter;
