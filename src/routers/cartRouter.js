import express from "express";
import {
  add_to_cart,
  cartById,
  cart_delete,
  cart_list,
  cart_update,
} from "../controllers/cartController.js";

const cartRouter = express.Router();
cartRouter.post("/add_to_cart", add_to_cart);
cartRouter.get("/cart_list", cart_list);
cartRouter.get("/cart_list/:id", cartById);
cartRouter.delete("/cart/:id", cart_delete);
cartRouter.put("/cart_update/:id", cart_update);
export default cartRouter;
