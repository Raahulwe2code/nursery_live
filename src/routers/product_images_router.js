import express from "express";

import {
  add_product_image, product_image_update, product_image, product_image_delete
} from "../controllers/product_images_controller.js";
import { auth_user, fetch_user, admin_auth } from '../../middleware/auth.js'

const product_images_router = express.Router();
product_images_router.post("/add_product_image", admin_auth, add_product_image);
product_images_router.post("/product_image_update", admin_auth, product_image_update);
product_images_router.post("/product_image", product_image);
product_images_router.put("/product_image_delete", admin_auth, product_image_delete);



export default product_images_router;