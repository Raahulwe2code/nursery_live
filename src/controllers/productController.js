import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function addproduct(req, res) {
  var { vendor_id, name, seo_tag, brand, quantity, unit, product_stock_quantity, price, mrp, review, discount, gst, cgst, sgst, rating, description, category } = req.body;
  console.log("body--" + JSON.stringify(req.body));
  console.log(mrp + " > " + price)
  const n_mrp = parseInt(mrp)
  const n_price = parseInt(price)

  console.log(n_mrp + " > " + n_price)
  console.log(n_mrp > n_price)
  if (n_mrp > n_price) {
    connection.query(
      ' INSERT INTO `product` (`vendor_id`,`name`,`seo_tag`,`brand`,`quantity`,`unit`,`product_stock_quantity`,`price`,`mrp`,`gst`,`sgst`,`cgst`,`category`,`review`,`discount`,`rating`,`description`) values ("' +
      vendor_id +
      '","' +
      name +
      '","' + seo_tag + '","' + brand + '","' + quantity + '","' + unit + '","' + product_stock_quantity + '","' +
      price +
      '","' + mrp + '","' +
      gst +
      '","' +
      sgst +
      '","' +
      cgst +
      '","' +
      category +
      '","' +
      review +
      '","' +
      discount +
      '", "' +
      rating +
      '","' +
      description +
      '") ',
      (err, result) => {
        if (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        } else {
          console.log("chk------------------70")
          console.log(result)
          res.status(StatusCodes.OK).json({ "response": "add successfull", "message": result });
        }
      }
    );
  } else {
    res.send({ "response": "product price is always less then product MRP" })
  }
}

export async function getallProduct(req, res) {
  connection.query("select * from product", (err, result) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "someting went wrong" });
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

export async function update_Product(req, res) {
  let {
    id, vendor_id, name, seo_tag, brand, quantity, unit, product_stock_quantity, price, mrp, review, discount, gst, cgst, sgst, rating, description, category, is_deleted, status, is_active } = req.body;


  console.log("data--" + JSON.stringify(req.body))

  connection.query(
    "update `product` set name='" +
    name + "',seo_tag='" + seo_tag + "',brand='" + brand + "',quantity='" + quantity + "',unit='" + unit + "',product_stock_quantity='" + product_stock_quantity + "',price='" +
    price + "', mrp ='" + mrp + "',review='" + review + "', discount='" + discount + "' ,rating='" + rating + "',description='" + description + "' ,category='" + category + "',vendor_id='" + vendor_id + "',gst='" + gst + "',sgst='" + sgst + "', cgst= '" + cgst + "', is_deleted='" + is_deleted + "',is_active='" + is_active +
    "' ,status='" +
    status +
    "' where id='" +
    id +
    "' ",
    (err, result) => {
      if (err) {
        res.status(500).send({ response: "error - opration failed" });
      } else {
        result.affectedRows == "1" ? res.status(200).json({ "response": result, "message": "update successfull" })
          : res.status(500).send({ response: "error - opration failed" })

      }
    }
  );
}

export async function delete_product(req, res) {

  connection.query(
    "delete  from product where id ='" + req.body.id + "'",
    (err, result) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
      } else {
        result.affectedRows == "1" ? res.status(StatusCodes.OK).json({ message: "delete successfully" }) : res.status(StatusCodes.OK).json({ message: "not delete " });

      }
    }
  );
}

export async function search_product(req, res) {
  var { price_from, price_to } = req.body;

  // 'SELECT *, (SELECT id FROM cart WHERE cart.product_id = product.id AND user_id = "' + req.user + '") FROM products  AND '


  // var query_string = "select * from product  where ";
  let search_obj = Object.keys(req.body)
  console.log(req.user_id)
  if (req.user_id != "" && req.user_id != undefined) {
    var search_string = 'SELECT *, (SELECT id FROM cart WHERE cart.product_id = product.id AND user_id = "' + req.user_id + '") AS cart,   (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = id AND image_position = "cover" group by product_images.product_id) AS cover_image FROM product where ';
  } else {
    var search_string = 'SELECT *,(SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = id AND image_position = "cover" group by product_images.product_id) AS cover_image FROM product where ';
  }


  console.log(search_obj)
  if (price_from != "" && price_to != "") {
    search_string += '(`price` BETWEEN "' + price_from + '" AND "' + price_to + '") AND   '
  }

  for (var i = 2; i <= search_obj.length - 1; i++) {
    if (i == 2) {
      if (req.body[search_obj[i]] != "") {
        search_string += `name LIKE "%${req.body[search_obj[i]]}%" AND   `
      }
    } else {
      if (req.body[search_obj[i]] != "") {
        var arr = JSON.stringify(req.body[search_obj[i]]);
        var abc = "'" + arr + "'"
        const id = abc.substring(abc.lastIndexOf("'[") + 2, abc.indexOf("]'"));
        search_string += ' ' + search_obj[i] + ' IN ' + '(' + id + ') AND   '

        // search_string+= `${search_obj[i]} = "${req.body[search_obj[i]]}" AND   `
      }
    }
    if (i === search_obj.length - 1) {
      search_string = search_string.substring(0, search_string.length - 6);
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
        console.log("" + search_string + " LIMIT " + limit + "")
        connection.query("" + search_string + " LIMIT " + limit + "",
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
              res.status(200).send(responsePayload);
            }
          }
        );
      }
    }
  );
}
