
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
  export{ensureAuth , ensureGuest}
  