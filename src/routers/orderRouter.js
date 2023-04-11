import express from "express";
import {
  add_order,
  orderById,
  order_delete,
  order_list,
  order_search,
  order_update,
} from "../controllers/orderController.js";
import {auth_user,fetch_user} from '../../middleware/auth.js'

const orderRouter = express.Router();
orderRouter.post("/add_order",auth_user, add_order);
orderRouter.post("/order_list", fetch_user,order_list);
orderRouter.post("/order_search", fetch_user,order_search);
orderRouter.get("/order_list/:id", orderById);
orderRouter.put("/order_update", auth_user ,order_update);
orderRouter.delete("/order_delete/:id",fetch_user, order_delete);
export default orderRouter;
