import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function addproduct(req, res) {
  var {
    vendor_id,
    name,
    seo_tag,
    brand,
    quantity,
    unit,
    product_stock_quantity,
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
  } else {
    image = "no image"
  }
  connection.query(
    ' INSERT INTO `product` (`vendor_id`,`name`,`seo_tag`,`brand`,`quantity`,`unit`,`product_stock_quantity`,`price`,`image`,`gst`,`cgst`,`sgst`,`category`,`is_active`,`review`,`discount`,`rating`,`description`,`is_deleted`,`status`) values ("' +
    vendor_id +
    '","' +
    name +
    '","' + seo_tag + '","' + brand + '","' + quantity + '","' + unit + '","' + product_stock_quantity + '","' +
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

export async function updtateProductById(req, res) {
  let {
    vendor_id,
    name,
    seo_tag,
    brand,
    quantity,
    unit,
    product_stock_quantity,
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

 console.log("data--"+JSON.stringify(req.body))

  if (req.file) {
    image = "http://localhost:5000/public/product_images/" + req.file.filename;
  }
  connection.query(
    "update `product` set name='"+
    name+"',seo_tag='"+seo_tag+"',brand='"+brand+"',quantity='"+quantity+"',unit='"+unit+"',product_stock_quantity='"+product_stock_quantity+"',price='" +
    price+"',image='"+image+"',review='"+review+"', discount='"+discount+"' ,rating='"+rating+"',description='"+description+"' ,category='"+category+"',vendor_id='"+vendor_id+"',gst='"+gst+"',sgst='"+sgst+"', cgst= '"+cgst +"', is_deleted='"+is_deleted +"',is_active='"+is_active +
    "' ,status='" +
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
  var { price_from, price_to} = req.body;

  // var query_string = "select * from product  where ";
  let search_obj = Object.keys(req.body)
  var search_string = "where ";
  
  console.log(search_obj)
if(price_from!=""&&price_to!=""){
  search_string+= '(`price` BETWEEN "'+price_from+'" AND "'+price_to+'") AND '
}

  for(var i=2;i<=search_obj.length-1;i++){
    if(i==2){
      if(req.body[search_obj[i]]!=""){
        search_string+= `name LIKE "%${req.body[search_obj[i]]}%" AND `
      }
    }else{
      if(req.body[search_obj[i]]!=""){
        search_string+= `${search_obj[i]} = "${req.body[search_obj[i]]}" AND `
      }
    }
    if(i===search_obj.length-1){
      search_string= search_string.substring(0, search_string.length-4);
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
console.log("SELECT * FROM product " +search_string+" LIMIT " +limit +"")
      connection.query(
        "SELECT * FROM product " +
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
            res.status(200).send(responsePayload);
          }
        }
      );
    }
  }
);

















return false



  if (
    search == "" &&
    category == "" &&
    price_to == "" &&
    price_from == "" &&
    rating == "" &&
    brand =="" &&
    seo_tag == "" &&
    vendor_id == ""
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
      rating == "" &&
      brand == "" &&
      seo_tag == "" &&
      vendor_id == ""
    ) {
      search_string += ' name LIKE "%' + search + '%" ';
    }

    if (
      search == "" &&
      category !== "" &&
      price_to == "" &&
      price_from == "" &&
      rating == "" &&
      brand == "" &&
      seo_tag == "" &&
      vendor_id == ""
    ) {
      search_string += '`category` LIKE "%' + category + '%" ';
    }

    if (
      search == "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating !== "" &&
      brand == "" &&
      seo_tag == "" &&
      vendor_id == ""
    ) {
      search_string += '`rating` LIKE "%' + rating + '%" ';
    }

    if (
      price_to !== "" &&
      price_from !== "" &&
      search == "" &&
      category == "" &&
      rating == "" &&
      brand == "" &&
      seo_tag == "" &&
      vendor_id == ""
    ) {
      search_string +=
        '`price` BETWEEN "' + price_from + '" AND "' + price_to + '" ';
    }




    if (
      search == "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating == "" &&
      brand !== "" &&
      seo_tag == "" &&
      vendor_id == ""
    ) {
      search_string += '`brand` LIKE "%' + brand + '%" ';
    }



    if (
      search == "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating == "" &&
      brand == "" &&
      seo_tag !== "" &&
      vendor_id == ""
    ) {
      search_string += '`seo_tag` LIKE "%' + seo_tag + '%" ';
    }


    if (
      search == "" &&
      category == "" &&
      price_to == "" &&
      price_from == "" &&
      rating == "" &&
      brand == "" &&
      seo_tag == "" &&
      vendor_id !== ""
    ) {
      search_string += '`vendor_id` LIKE "%' + vendor_id + '%" ';
    }





    if (
      search !== "" &&
      category !== "" &&
      price_to !== "" &&
      price_from !== "" &&
      rating !== "" &&
      brand !== "" &&
      seo_tag !== "" &&
      vendor_id !== ""
    ) {
      search_string +='name LIKE "%'+search +'%" AND`category` LIKE "%'+category +'%" AND  `rating` LIKE "%' +rating +'%" AND `seo_tag` LIKE "%'+seo_tag+'%" AND `brand` LIKE "%'+brand+'%" AND `vendor_id` LIKE "%'+vendor_id+'%" AND `price` BETWEEN "' +
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
      rating !== "" &&
      brand !== "" &&
      seo_tag !== "" &&
      vendor_id !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%"   AND `seo_tag` LIKE "%' + seo_tag + '%" AND brand="%' + brand + '%"  AND vendor_id="%' + vendor_id + '%"  AND `price` BETWEEN "' +
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
      rating !== "" &&
      brand !== "" &&
      seo_tag !== "" &&
      vendor_id !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%" AND `seo_tag` LIKE "%' + seo_tag + '%" AND brand="%' + brand + '%"  AND vendor_id="%' + vendor_id + '%" AND `price` BETWEEN "' +
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
      rating !== "" &&
      brand !== "" &&
      seo_tag !== "" &&
      vendor_id !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%"  AND `seo_tag` LIKE "%' + seo_tag + '%" AND brand="%' + brand + '%"  AND vendor_id="%' + vendor_id + '%"  AND `price` BETWEEN "' +
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
      rating !== "" &&
      brand !== "" &&
      seo_tag !== "" &&
      vendor_id !== ""
    ) {
      search_string +=
        'name LIKE "%' +
        search +
        '%" AND`category` LIKE "%' +
        category +
        '%" AND  `rating` LIKE "%' +
        rating +
        '%"  AND `seo_tag` LIKE "%' + seo_tag + '%" AND brand="%' + brand + '%"  AND vendor_id="%' + vendor_id + '%" AND `price` BETWEEN "' +
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
console.log("-----query"+search_string)
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

  }
}
