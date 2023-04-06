// SELECT `order`.`id`, `order`.`order_date`,`user`.`first_name`, `user`.`last_name` from `order` INNER JOIN `user` ON `order`.`user_id`= `user`.`id`
//CREATE VIEW cart_view AS SELECT cart.id as id, cart.product_id,cart.user_id,product.name,product.price,product.image FROM cart INNER JOIN product ON product.id =cart.product_id

// CREATE VIEW user_view AS SELECT user.id as User_id, user.first_name , user.last_name , user.email, user.password , user.phone_no, user.pincode, user.city, user.address , user.alternate_address, user.created_on ,cart.quantity, cart.id , cart.user_id as user_cart_id , cart.product_id FROM user INNER JOIN cart ON cart.user_id =user.id

// CREATE VIEW order_view AS SELECT order.id as Order_id, order.user_id , order.total_quantity ,order.total_amount, order.total_gst, order.total_cgst, order.total_sgst, order.shipping_charges, order.invoice_id, order.payment_mode, order.payment_ref_id, order.order_date ,order.delivery_date, order.invoice_date, order.discount_coupon, order.discount_coupon_value ,order.created_on , user.id as User_id FROM `order` INNER JOIN user ON order.user_id = user.id
