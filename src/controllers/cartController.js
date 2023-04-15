import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_to_cart(req, res) {
 var {user_id,product_id,cart_product_quantity}= req.body;

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

export  function cart_list(req, res) {
var str_cart=""
var {user_id}=req.body


if(req.for_=='admin'){
  if(user_id!=''){
    str_cart = "select * from cart_view_1 where user_id='"+user_id+"'"
  }else{
    str_cart = "select * from cart_view_1"
  }
}else{
  if(req.for_=='user'){
    user_id = ""
    str_cart = "select * from cart_view_1 where user_id='"+req.user_id+"'"
  }
}
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
  var { user_id, product_id, cart_product_quantity } = req.body;
  const id = req.params.id;
  connection.query(
    "update cart set product_id='"+product_id+"',cart_product_quantity='"+cart_product_quantity+"' where id ='"+id+"' AND user_id='"+user_id+"'",(err, rows) => {
      if(err) {
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
  const {id,user_id} = req.body

  connection.query("delete from cart where id ='" + id + "' AND user_id='"+user_id+"'", (err, rows) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}
