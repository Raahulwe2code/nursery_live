import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_order(req, res) {
  var orderno = Math.floor(100000 + Math.random() * 900000);

  var {
    user_id,
    total_quantity,
    total_amount,
    total_gst,
    total_cgst,
    total_sgst,
    total_discount,
    shipping_charges,
    invoice_id,
    payment_mode,
    payment_ref_id,
    discount_coupon,
    discount_coupon_value,
  } = req.body;

  connection.query(
    "insert into `order` ( `id`,`user_id`, `total_quantity`,`total_amount`,`total_gst`,`total_cgst`, `total_sgst`,`total_discount`, `shipping_charges`,`invoice_id`, `payment_mode`,`payment_ref_id`, `discount_coupon`,`discount_coupon_value`) VALUES ('" +
      orderno +
      "', '" +
      user_id +
      "','" +
      total_quantity +
      "','" +
      total_amount +
      "','" +
      total_gst +
      "','" +
      total_cgst +
      "','" +
      total_sgst +
      "','" +
      total_discount +
      "','" +
      shipping_charges +
      "','" +
      invoice_id +
      "','" +
      payment_mode +
      "','" +
      payment_ref_id +
      "','" +
      discount_coupon +
      "','" +
      discount_coupon_value +
      "' )",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function order_list(req, res) {
  connection.query(" select * from `order`", (err, rows) => {
    if (err) {
      res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function orderById(req, res) {
  const id = req.params.id;
  connection.query(
    "select * from `order` where id ='" + id + "' ",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function order_update(req, res) {
  var {
    user_id,
    total_quantity,
    total_amount,
    total_gst,
    total_cgst,
    total_sgst,
    total_discount,
    shipping_charges,
    invoice_id,
    payment_mode,
    payment_ref_id,
    discount_coupon,
    discount_coupon_value,
  } = req.body;

  const id = req.params.id;

  connection.query(
    "update `order` set user_id ='" +
      user_id +
      "', total_quantity='" +
      total_quantity +
      "' , total_amount='" +
      total_amount +
      "', total_gst='" +
      total_gst +
      "', total_sgst='" +
      total_sgst +
      "', total_cgst='" +
      total_cgst +
      "', total_discount='" +
      total_discount +
      "', shipping_charges='" +
      shipping_charges +
      "', invoice_id='" +
      invoice_id +
      "', payment_mode='" +
      payment_mode +
      "', payment_ref_id='" +
      payment_ref_id +
      "', discount_coupon='" +
      discount_coupon +
      "', discount_coupon_value='" +
      discount_coupon_value +
      "'  where id ='" +
      id +
      "' ",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function order_delete(req, res) {
  const id = req.params.id;

  connection.query(
    "delete from `order` where id ='" + id + "' ",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}
