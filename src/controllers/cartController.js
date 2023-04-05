import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_to_cart(req, res) {
  var { user_id, product_id, quantity } = req.body;

  connection.query(
    "insert into cart (`user_id`, `product_id`,`quantity` )  VALUES ('" +
      user_id +
      "', '" +
      product_id +
      "','" +
      quantity +
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

export async function cart_list(req, res) {
  connection.query("select * from cart ", (err, rows) => {
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
  var { user_id, product_id, quantity } = req.body;
  const id = req.params.id;
  connection.query(
    "update cart set `user_id`='" +
      user_id +
      "', product_id='" +
      product_id +
      "', quantity='" +
      quantity +
      "' where id ='" +
      id +
      "' ",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json({ message: "cart updated" });
      }
    }
  );
}

export async function cart_delete(req, res) {
  const id = req.params.id;

  connection.query("delete from cart where id ='" + id + "' ", (err, rows) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}
