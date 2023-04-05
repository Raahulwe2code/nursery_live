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

export async function user_search(req, res) {
  var { search } = req.body;
  if (search == "") {
    connection.query("select * from user where 1", (err, rows) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    });
  } else {
    if (search !== "") {
      var search_string = "";
      search_string +=
        ' `first_name` LIKE  "%' +
        search +
        '%" OR `email` LIKE "%' +
        search +
        '%" ';

      connection.query(
        "select * from user where" + search_string + "",
        (err, rows) => {
          if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
          } else {
            res.status(StatusCodes.OK).json(rows);
          }
        }
      );
    }
  }
}
