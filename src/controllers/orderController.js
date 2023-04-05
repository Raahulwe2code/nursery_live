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

export async function order_search(req, res) {
  var { search } = req.body;

  // var query_string = "select * from product  where ";

  if (search == "") {
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
            "select * from order_view LIMIT " + limit + "",
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

    if (search !== "") {
      search_string += ' Order_id LIKE "%' + search + '%" ';
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
            "SELECT * FROM order_view where " +
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
  }
}
