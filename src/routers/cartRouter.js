import express from "express";
import {
  add_to_cart,
  cartById,
  cart_delete,
  cart_list,
  cart_update,
} from "../controllers/cartController.js";
import {auth_user,fetch_user,admin_auth} from '../../middleware/auth.js'
const cartRouter = express.Router();
cartRouter.post("/add_to_cart",auth_user, add_to_cart);
cartRouter.post("/cart_list",fetch_user, cart_list);
cartRouter.get("/cart_list/:id",fetch_user, cartById);
cartRouter.put("/cart_delete",admin_auth, cart_delete);
cartRouter.put("/cart_update/:id",auth_user ,cart_update);
export default cartRouter;
