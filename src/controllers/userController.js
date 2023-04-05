import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_user(req, res) {
  var {
    first_name,
    last_name,
    email,
    password,
    phone_no,
    pincode,
    city,
    address,
    alternate_address,
    is_deleted,
  } = req.body;

  connection.query(
    "insert into user  ( `first_name`, `last_name`, `email`,`password`,`phone_no`,`pincode`,`city`,`address`,`alternate_address`,`is_deleted`) VALUES('" +
      first_name +
      "', '" +
      last_name +
      "', '" +
      email +
      "','" +
      password +
      "', '" +
      phone_no +
      "', '" +
      pincode +
      "', '" +
      city +
      "', '" +
      address +
      "','" +
      alternate_address +
      "', '" +
      is_deleted +
      "') ",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json({ message: "user added successfully" });
      }
    }
  );
}

export async function getalluser(req, res) {
  connection.query("select * from user", (err, rows) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "something went wrong" });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function userByid(req, res) {
  const id = req.params.id;
  connection.query("select * from user where id= '" + id + "'", (err, rows) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "something went wrong" });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function update_user(req, res) {
  var {
    first_name,
    last_name,
    email,
    password,
    phone_no,
    pincode,
    city,
    address,
    alternate_address,
    is_deleted,
  } = req.body;

  const id = req.params.id;
  connection.query(
    "update user  set `first_name`= '" +
      first_name +
      "' , `last_name`='" +
      last_name +
      "', `email` ='" +
      email +
      "', `password`='" +
      password +
      "', `phone_no` ='" +
      phone_no +
      "', `pincode` ='" +
      pincode +
      "', `city`='" +
      city +
      "', `address`='" +
      address +
      "', `alternate_address`='" +
      alternate_address +
      "', `is_deleted`='" +
      is_deleted +
      "' where id ='" +
      id +
      "' ",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: "updated user successfully" });
      }
    }
  );
}

export async function delete_user(req, res) {
  const id = req.params.id;
  connection.query(" delete from user where id='" + id + "'", (err, rows) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    } else {
      res.status(StatusCodes.OK).json({ message: "delete user successfully" });
    }
  });
}

// SELECT `order`.`id`, `order`.`order_date`,`user`.`first_name`, `user`.`last_name` from `order` INNER JOIN `user` ON `order`.`user_id`= `user`.`id`
//CREATE VIEW cart_view AS SELECT cart.id as id, cart.product_id,cart.user_id,product.name,product.price,product.image FROM cart INNER JOIN product ON product.id =cart.product_id

// CREATE VIEW user_view AS SELECT user.id as User_id, user.first_name , user.last_name , user.email, user.password , user.phone_no, user.pincode, user.city, user.address , user.alternate_address, user.created_on ,cart.quantity, cart.id , cart.user_id as user_cart_id , cart.product_id FROM user INNER JOIN cart ON cart.user_id =user.id

// CREATE VIEW order_view AS SELECT order.id as Order_id, order.user_id , order.total_quantity ,order.total_amount, order.total_gst, order.total_cgst, order.total_sgst, order.shipping_charges, order.invoice_id, order.payment_mode, order.payment_ref_id, order.order_date ,order.delivery_date, order.invoice_date, order.discount_coupon, order.discount_coupon_value ,order.created_on , user.id as User_id FROM `order` INNER JOIN user ON order.user_id = user.id
