import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function addproduct(req, res) {
  var {
    vendor_id,
    name,
    price,
    image,
    review,
    discount,
    gst,
    cgst,
    sgst,
    rating,
    description,
    category,
    is_deleted,
    status,
    is_active,
  } = req.body;
  console.log("body--" + JSON.stringify(req.body));
  if (req.file) {
    image = "http://localhost:5000/public/product_images/" + req.file.filename;
  }
  connection.query(
    ' INSERT INTO `product` (`vendor_id`,`name`,`price`,`image`,`gst`,`cgst`,`sgst`,`category`,`is_active`,`review`,`discount`,`rating`,`description`,`is_deleted`,`status`) values ("' +
      vendor_id +
      '","' +
      name +
      '","' +
      price +
      '","' +
      image +
      '" ,"' +
      gst +
      '","' +
      cgst +
      '","' +
      sgst +
      '","' +
      category +
      '","' +
      is_active +
      '","' +
      review +
      '","' +
      discount +
      '", "' +
      rating +
      '","' +
      description +
      '","' +
      is_deleted +
      '","' +
      status +
      '") ',
    (err, result) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
      } else {
        res.status(StatusCodes.OK).json({ result });
      }
    }
  );
}

export async function getallProduct(req, res) {
  connection.query("select * from product", (err, result) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "someting went wron" });
    } else {
      res.status(StatusCodes.OK).json(result);
    }
  });
}

export async function getProductbyId(req, res) {
  connection.query(
    "select * from product where id='" + req.params.id + "'",
    (err, result) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "someting went wrong" });
      } else {
        res.status(StatusCodes.OK).json(result);
      }
    }
  );
}

export async function updtateProductById(req, res) {
  let {
    vendor_id,
    name,
    price,
    image,
    review,
    discount,
    gst,
    cgst,
    sgst,
    rating,
    description,
    category,
    is_deleted,
    status,
    is_active,
  } = req.body;

  let id = req.params.id;

  res.status(200).send(JSON.stringify(req.body));

  if (req.file) {
    image = "http://localhost:5000/public/product_images/" + req.file.filename;
  }
  connection.query(
    "update plants set name='" +
      name +
      "' , price='" +
      price +
      "', image='" +
      image +
      "', review='" +
      review +
      "', discount='" +
      discount +
      "' , rating='" +
      rating +
      "' , description='" +
      description +
      "' , category='" +
      category +
      "',vendor_id='" +
      vendor_id +
      "', gst='" +
      gst +
      "' sgst='" +
      sgst +
      "', cgst= '" +
      cgst +
      "', is_deleted='" +
      is_deleted +
      "', is_active='" +
      is_active +
      "' , status='" +
      status +
      "' where id='" +
      id +
      "' ",
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json({ message: result });
      }
    }
  );
}

export async function deleteById(req, res) {
  connection.query(
    "delete  from product where id ='" + req.params.id + "'",
    (err, result) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
      } else {
        res.status(StatusCodes.OK).json({ message: "delete successfully" });
      }
    }
  );
}

export async function search_product(req, res) {
  var { price_from, price_to, category, rating, search, per_page, page_no } =
    req.body;

  // var query_string = "select * from product  where ";

  if (
    search == "" &&
    category == "" &&
    price_to == "" &&
    price_from == "" &&
    rating == "" &&
    per_page > 1 &&
    page_no > 1
  ) {
    if (per_page > 1) {
      var limit = per_page;
      var offset = (page_no - 1) * per_page;
    } else {
      var offset = 0;
    }
    console.log("limit--" + limit);

    console.log("offset--" + offset);
    connection.query(
      "SELECT * FROM `product` where 1 order BY name Desc LIMIT " +
        limit +
        " OFFSET " +
        offset +
        " ",

      (err, rows) => {
        if (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        } else {
          res.status(StatusCodes.OK).send(rows);
        }
      }
    );
  } else {
    var search_string = "";

    if (
      search !== "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating == ""
    ) {
      search_string += ' name LIKE "%' + search + '%" ';
    }

    if (
      search == "" &&
      category !== "" &&
      price_to == "" &&
      price_from == "" &&
      rating == ""
    ) {
      search_string += '`category` LIKE "%' + category + '%" ';
    }

    if (
      search == "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating !== ""
    ) {
      search_string += '`rating` LIKE "%' + rating + '%" ';
    }

    if (
      price_to !== "" &&
      price_from !== "" &&
      search == "" &&
      category == "" &&
      rating == ""
    ) {
      search_string +=
        '`price` BETWEEN "' + price_from + '" AND "' + price_to + '" ';
    }

    if (
      search !== "" &&
      category !== "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `price` BETWEEN "' +
        price_from +
        '" AND "' +
        price_to +
        '"   ';
    }

    if (
      search == "" &&
      category !== "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `price` BETWEEN "' +
        price_from +
        '" AND "' +
        price_to +
        '"   ';
    }

    if (
      search == "" &&
      category == "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `price` BETWEEN "' +
        price_from +
        '" AND "' +
        price_to +
        '"   ';
    }

    if (
      search !== "" &&
      category == "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `price` BETWEEN "' +
        price_from +
        '" AND "' +
        price_to +
        '"   ';
    }

    if (
      search !== "" &&
      category == "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating == ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `price` BETWEEN "' +
        price_from +
        '" AND "' +
        price_to +
        '"   ';
    }

    var sql_query = "SELECT * FROM product where " + search_string;
    console.log("--" + sql_query);
    connection.query(sql_query, (err, rows) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    });
  }
}
