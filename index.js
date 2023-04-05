import connection from "./Db.js";
import express from "express";
import "dotenv/config";
import productRouter from "./src/routers/productRouter.js";
import cors from "cors";

import bodyParser from "body-parser";
import cartRouter from "./src/routers/cartRouter.js";
import userRouter from "./src/routers/userRouter.js";
import orderRouter from "./src/routers/orderRouter.js";

const app = express();
connection;
app.use(cors());

app.use(bodyParser.json());
// to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(express.static("public"));

app.use(productRouter, cartRouter, userRouter, orderRouter);

app.listen(5000, () => {
  console.log(`server is running at ${process.env.SERVERPORT}`);
});
