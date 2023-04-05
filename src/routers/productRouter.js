import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import path from "path";
import {
  addproduct,
  deleteById,
  getallProduct,
  getProductbyId,
  search_product,
  updtateProductById,
} from "../controllers/productController.js";

const app = express();
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/product_images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now();
    cb(null, name + ext);
  },
});

const upload = multer({ storage: storage });

const productRouter = express.Router();

productRouter.post("/addProduct", upload.single("image"), addproduct);
productRouter.post(
  "/getproduct/:id",
  upload.single("image"),
  updtateProductById
);

productRouter.get("/getproduct", getallProduct);
productRouter.get("/getproduct/:id", getProductbyId);

productRouter.delete("/delete_product/:id", deleteById);
productRouter.get("/search", search_product);
export default productRouter;
