import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

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

  connection.query(
    "insert into `order` ( `order_id`, `product_id`,`user_id`, `total_order_product_quantity`,`total_amount`,`total_gst`,`total_cgst`, `total_sgst`,`total_discount`, `shipping_charges`,`invoice_id`, `payment_mode`,`payment_ref_id`, `discount_coupon`,`discount_coupon_value`) VALUES ('" +orderno +"','"+product_id+"', '" +req.user_id +"','" +total_order_product_quantity +
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

        connection.query("SELECT product_stock_quantity FROM product WHERE id='" +product_id +"'",
          (err, result) => {
            if (err) {
              res.status(500).send(err);
            } else {
              console.log("________chk qty.")
              console.log(result)
             let update_stock_qty =  result.product_stock_quantity - total_order_product_quantity
if(update_stock_qty>=0){

}

              // connection.query(
              //   "update `product` set name = product_stock_quantity='"+total_order_product_quantity+"' where id='" +product_id +"'",
              //   (err, result) => {
              //     if (err) {
              //       res.status(500).send(err);
              //     } else {
              //       // res.status(200).json({ message: result });
              //     }
              //   }
              // );
              res.status(StatusCodes.OK).json(rows);

            }
          }
        );

      }
    }
  );
}

export async function order_list(req, res) {
  
  if(req.for_=='admin'){
    if(user_id!=''){
      str_order = "select * from `order` where user_id='"+user_id+"'"
    }else{
      str_order = "select * from `order`"
    }
  }else{
    if(req.for_=='user'){
      user_id = ""
      str_order = "select * from `order` where user_id='"+req.user_id+"'"
    }
  }
  connection.query(str_order, (err, rows) => {
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
var search_string=""
console.log(req.user_id)
if(req.for_=='admin'){
  if(req.body.user_id!=''&&req.body.user_id!=undefined){
     search_string += "SELECT * FROM order_view where "
  }else{
     search_string += "SELECT * FROM order_view where"
  }
}else{
  if(req.for_=='user'){
     
     search_string = "SELECT * FROM order_view where user_id='"+req.user_id+"' AND "
  }
}


console.log(search_obj)
for(var i=0;i<=search_obj.length-1;i++){
  if(i==0){
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
