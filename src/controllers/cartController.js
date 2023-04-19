import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_to_cart(req, res) {
  var { product_id, cart_product_quantity } = req.body;

  connection.query(
    "insert into cart (`user_id`, `product_id`,`cart_product_quantity` )  VALUES ('" +
    req.user_id +
    "', '" +
    product_id +
    "','" +
    cart_product_quantity +
    "')",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INSUFFICIENT_STORAGE)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export function cart_list(req, res) {
  var str_cart = 'select *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image from cart_view_1 where user_id="' + req.user_id + '"'

  console.log(str_cart)
  connection.query(str_cart, (err, rows) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "something went wrong" });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function cartById(req, res) {
  const id = req.params.id;
  connection.query(
    "select * from cart where id= '" + id + "' ",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function cart_update(req, res) {
  var { id, product_id, cart_product_quantity } = req.body;
  connection.query(
    "update cart set product_id='" + product_id + "',cart_product_quantity='" + cart_product_quantity + "' where id ='" + id + "' AND user_id='" + req.user_id + "'", (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ "message": "something went wrong" });
      } else {
        rows.affectedRows == "1" ? res.status(200).json({ "response": rows, "message": "update successfull" }) : res.status(200).json({ "response": rows, "message": "update opration failed" })

      }
    }
  );
}

export async function cart_delete(req, res) {
  const { id } = req.body

  connection.query("delete from cart where id ='" + id + "' AND user_id='" + req.user_id + "'", (err, rows) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "delete opration failed" });
    } else {
      rows.affectedRows == "1" ? res.status(200).json({ "response": rows, "message": "delete successfull" }) : res.status(200).json({ "response": rows, "message": "delete opration failed" })
    }
  });
}
