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
  var { price_from, price_to, category, rating, search } = req.body;

  // var query_string = "select * from product  where ";

  if (
    search == "" &&
    category == "" &&
    price_to == "" &&
    price_from == "" &&
    rating == ""
  ) {
    var pg = req.query;
    var numRows;

    var numPerPage = pg.per_page;
    var page = parseInt(pg.page, pg.per_page) || 0;
    var numPages;
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + "," + numPerPage;

    connection.query(
      "SELECT count(*) as numRows FROM product",
      (err, results) => {
        if (err) {
        } else {
          numRows = results[0].numRows;
          numPages = Math.ceil(numRows / numPerPage);

          connection.query(
            "select * from product LIMIT " + limit + "",
            (err, results) => {
              if (err) {
                //console.log(err)
                res.status(502).send(err);
              } else {
                // //console.log("_____")
                var responsePayload = {
                  results: results,
                };
                if (page < numPages) {
                  responsePayload.pagination = {
                    current: page,
                    perPage: numPerPage,
                    previous: page > 0 ? page - 1 : undefined,
                    next: page < numPages - 1 ? page + 1 : undefined,
                  };
                } else
                  responsePayload.pagination = {
                    err:
                      "queried page " +
                      page +
                      " is >= to maximum page number " +
                      numPages,
                  };
                // //console.log("responsePayload++++++++++++++++++++++++++++++++++++++++");
                ////console.log(responsePayload);
                res.status(200).send(responsePayload);
              }
            }
          );
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

    var pg = req.query;
    var numRows;

    var numPerPage = pg.per_page;
    var page = parseInt(pg.page, pg.per_page) || 0;
    var numPages;
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + "," + numPerPage;

    connection.query(
      "SELECT count(*) as numRows FROM product",
      (err, results) => {
        if (err) {
        } else {
          numRows = results[0].numRows;
          numPages = Math.ceil(numRows / numPerPage);

          connection.query(
            "SELECT * FROM product where " +
              search_string +
              " LIMIT " +
              limit +
              "",
            (err, results) => {
              if (err) {
                //console.log(err)
                res.status(502).send(err);
              } else {
                // //console.log("_____")
                var responsePayload = {
                  results: results,
                };
                if (page < numPages) {
                  responsePayload.pagination = {
                    current: page,
                    perPage: numPerPage,
                    previous: page > 0 ? page - 1 : undefined,
                    next: page < numPages - 1 ? page + 1 : undefined,
                  };
                } else
                  responsePayload.pagination = {
                    err:
                      "queried page " +
                      page +
                      " is >= to maximum page number " +
                      numPages,
                  };
                // //console.log("responsePayload++++++++++++++++++++++++++++++++++++++++");
                ////console.log(responsePayload);
                res.status(200).send(responsePayload);
              }
            }
          );
        }
      }
    );

    // var sql_query = "SELECT * FROM product where " + search_string;
    // console.log("--" + sql_query);
    // connection.query(sql_query, (err, rows) => {
    //   if (err) {
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    //   } else {
    //     res.status(StatusCodes.OK).json(rows);
    //   }
    // });
  }
}
