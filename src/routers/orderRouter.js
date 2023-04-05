import express from "express";
import {
  add_order,
  orderById,
  order_delete,
  order_list,
  order_update,
} from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/add_order", add_order);
orderRouter.get("/order_list", order_list);
orderRouter.get("/order_list/:id", orderById);
orderRouter.put("/order_update/:id", order_update);
orderRouter.delete("/order_delete/:id", order_delete);
export default orderRouter;
