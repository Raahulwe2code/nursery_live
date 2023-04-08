
     function ensureAuth(req, res, next) {
        console.log("mid____ensureAuth_______chk")
      if (req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/')
      }
    } 
    function ensureGuest (req, res, next) {
        console.log("mid____ensureGuest_______chk")

      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/log');
      }
    }

    function admin_auth(req, res, next){
      console.log("chek______________________________________________middleware___"+req.headers.admin_token)
      if(req.headers.admin_token!="" && req.headers.admin_token!=undefined){
        if(req.headers.admin_token=="admin_master_token=we2code_123456"){
          next()
        }else{
          res.send({"error":"token not match"})
        }
      }else if(req.headers.vendor_token!=""&&req.headers.vendor_token!=undefined){
        if(req.headers.vendor_token=="vendor_master_token=we2code_123456"){
          next()
        }else{
          res.send({"error":"token not match"})
        }
      }else{
        res.send({"error":"token error"})
      }
      
    }


  export{ensureAuth , ensureGuest, admin_auth}
  