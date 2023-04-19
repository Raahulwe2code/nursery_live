import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer"


export async function add_order(req, res) {
  var orderno = Math.floor(100000 + Math.random() * 900000);

  var {
    product_id,
    total_order_product_quantity,
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
  console.log("user_id=============================================22")
  console.log(req.user_id)

  connection.query("SELECT * FROM user WHERE id='" + req.user_id + "'",
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(result)
        var { first_name, last_name, email, phone_no, pincode, city, address, alternate_address } = result[0]
        if (first_name != '' && last_name != '' && email != '' && phone_no != '' && pincode != '' && city != '' && address != '' && alternate_address != '') {
          console.log("true")
          connection.query("SELECT product_stock_quantity FROM product WHERE id='" + product_id + "'",
            (err, result) => {
              if (err) {
                res.status(500).send(err);
              } else {
                console.log("________chk qty.")
                console.log(result)
                console.log(parseInt(result[0].product_stock_quantity))
                var update_stock_qty = parseInt(result[0].product_stock_quantity) - parseInt(total_order_product_quantity)
                console.log("--------------------update_stock_qty-----------------")
                console.log(update_stock_qty)
                if (update_stock_qty >= 0 && total_order_product_quantity > 0) {
                  connection.query(
                    "insert into `order` ( `order_id`, `product_id`,`user_id`, `total_order_product_quantity`,`total_amount`,`total_gst`,`total_cgst`, `total_sgst`,`total_discount`, `shipping_charges`,`invoice_id`, `payment_mode`,`payment_ref_id`, `discount_coupon`,`discount_coupon_value`) VALUES ('" + orderno + "','" + product_id + "', '" + req.user_id + "','" + total_order_product_quantity +
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
                        res.status(StatusCodes.INSUFFICIENT_STORAGE).json({ "response": "find error", "status": false });
                      } else {

                        connection.query(
                          // UPDATE `product` SET `product_stock_quantity` = '11' WHERE `product`.`id` = 16;
                          "UPDATE `product` SET product_stock_quantity='" + update_stock_qty + "' WHERE id='" + product_id + "'",
                          (err, result) => {
                            if (err) {
                              console.log(err)
                              res.status(500).send({ "response": "find error", "status": false });
                            } else {
                              // res.status(200).json({ message: result });
                            }
                          }
                        );
                        connection.query('INSERT INTO `notification`(`actor_id`, `actor_type`, `message`, `status`) VALUES ("' + req.user_id + '","user","successfully placed order,order_no. ' + orderno + '","unread"),("001","admin","recived order (order_no. ' + orderno + ') by ' + first_name + ', user_id ' + req.user_id + '","unread")', (err, rows) => {
                          if (err) {
                            //console.log({ "notification": err })
                          } else {
                            console.log("_______notification-send__94________")
                          }
                        })
                        const mail_configs = {
                          from: 'ashish.we2code@gmail.com',
                          to: email,
                          subject: 'order status ',
                          text: "order added successfully",
                          html: "<h1>order added successfully<h1/>"
                        }
                        nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'ashish.we2code@gmail.com',
                            pass: 'nczaguozpagczmjv'
                          }
                        })
                          .sendMail(mail_configs, (err) => {
                            if (err) {
                              return //console.log({ "email_error": err });
                            } else {
                              return { "send_mail_status": "send successfully" };
                            }
                          })
                        res.status(StatusCodes.OK).json({ "status": "ok", "order_id": orderno, "response": "order successfully added", "id": rows.insertId, "status": true });
                      }
                    }
                  );
                } else {
                  res.send({ "response": "product stock unavailable", "status": false })
                }

              }
            }
          );

        } else {
          console.log("false")
          res.status(200).send({ response: "please complete your profile", "status": false })

        }

      }
    })

}

export async function order_list(req, res) {

  if (req.for_ == 'admin') {
    if (user_id != '') {
      str_order = "select * from `order` where user_id='" + user_id + "'"
    } else {
      str_order = "select * from `order`"
    }
  } else {
    if (req.for_ == 'user') {
      user_id = ""
      str_order = "select * from `order` where user_id='" + req.user_id + "'"
    }
  }
  connection.query(str_order, (err, rows) => {
    if (err) {
      res.status(StatusCodes.INSUFFICIENT_STORAGE).json({ "response": "find error", "status": false });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function order_details(req, res) {
  const id = req.params.id;
  connection.query(
    'select *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image   FROM order_view_1 from `order_view` where order_id ="' + id + '" ',
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
    req.user +
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
  let search_obj = Object.keys(req.body)
  // var search_string = "where ";
  var search_string = ""
  console.log(req.user_id)
  if (req.for_ == 'admin') {
    if (req.body.user_id != '' && req.body.user_id != undefined) {
      search_string += 'SELECT *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image  FROM order_view_1 where'
    } else {
      search_string += 'SELECT *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image FROM order_view_1 where'
    }
  } else {
    if (req.for_ == 'user') {

      search_string = 'SELECT *,(SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image   FROM order_view_1 where user_id="' + req.user_id + '" AND '
    }
  }


  console.log(search_obj)
  for (var i = 0; i <= search_obj.length - 1; i++) {
    if (i == 0) {
      if (req.body[search_obj[i]] != "") {
        search_string += ` name LIKE "%${req.body[search_obj[i]]}%" AND `
      }
    } else {

      if (req.body[search_obj[i]] != "") {
        search_string += ` ${search_obj[i]} = "${req.body[search_obj[i]]}" AND `
      }
    }
    if (i === search_obj.length - 1) {
      search_string = search_string.substring(0, search_string.length - 5);
    }
  }

  console.log(search_string)
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

        connection.query(search_string +
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
  // }
}

export function order_status_update(req, res) {
  console.log("order_status_update-----------------")
  console.log(req.body)
  let email_user = ""
  connection.query("SELECT * FROM user WHERE id='" + req.body.user_id + "'",
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(result)
        email_user = result[0].email
        connection.query('INSERT INTO `notification`(`actor_id`, `actor_type`, `message`, `status`) VALUES ("' + req.body.user_id + '","user","order your order current staus is ' + req.body.status_order + '","unread"),("001","admin","successfully changed user (user_id ' + req.body.user_id + ') order status","unread")', (err, rows) => {
          if (err) {
            //console.log({ "notification": err })
          } else {
            console.log("_______notification-send__94________")
          }
        })
        connection.query(
          "UPDATE `order` SET status_order='" + req.body.status_order + "' WHERE order_id='" + req.body.order_id + "'",
          (err, result) => {
            if (err) {
              console.log(err)
              res.status(500).send({ "response": "find error", "status": false });
            } else {
              const mail_configs = {
                from: 'ashish.we2code@gmail.com',
                to: email_user,
                subject: 'order status change',
                text: "order your order current staus is " + req.body.status_order + "",
                html: "<h1> your order current staus is " + req.body.status_order + "<h1/>"
              }
              nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ashish.we2code@gmail.com',
                  pass: 'nczaguozpagczmjv'
                }
              })
                .sendMail(mail_configs, (err) => {
                  if (err) {
                    return //console.log({ "email_error": err });
                  } else {
                    return { "send_mail_status": "send successfully" };
                  }
                })
              console.log(result)
              if (result.affectedRows == '1') {
                res.status(200).json({ "response": "status updated successfully", "res_db": result, "status": true });
              } else {
                res.status(200).json({ "response": "status update opration failed", "res_db": result, "status": false });
              }

            }
          }
        );
      }
    })

}