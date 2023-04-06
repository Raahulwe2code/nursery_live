import connection from "./Db.js";
import express from "express";
import "dotenv/config";
import productRouter from "./src/routers/productRouter.js";
import cors from "cors";
import jwt from 'jsonwebtoken'
import bodyParser from "body-parser";
import cartRouter from "./src/routers/cartRouter.js";
import userRouter from "./src/routers/userRouter.js";
import orderRouter from "./src/routers/orderRouter.js";
import mongoose from 'mongoose';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport  from 'passport'
import session from 'express-session';
import connectMongo from 'connect-mongo'; 
const MongoStore = connectMongo(session);
import { ensureAuth, ensureGuest }  from '../nursery_live/middleware/auth.js'

const app = express();
connection;
app.use(cors());

app.use(bodyParser.json());
// to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(express.static("public"));

app.use(productRouter, cartRouter, userRouter, orderRouter);


mongoose.connect("mongodb+srv://Raahul_verma:vw48MlF9mMcMJL7y@cluster0.hxtq31y.mongodb.net/CrudNew?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
})



import passportConfig from "./passport.js";

passportConfig(passport);


// require('./passport')(passport)

app.set('view engine','ejs');

app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
app.use(passport.initialize())
app.use(passport.session())

app.get("/auth_with_google",ensureGuest, (req, res) => {
  console.log("/abc")
  res.render('login')
})

app.get("/log",ensureAuth, async(req,res)=>{
  // res.send(req.user)
  var {firstName,lastName,email}=req.user
  connection.query("INSERT INTO `user`( `first_name`, `last_name`, `email`) VALUES ('"+firstName+"','"+lastName+"','"+email+"')",async (err, rows, fields) => {
    if(err){
      //console.log("error"+err)
      
      if(err.code == "ER_DUP_ENTRY"){
        res.status(200).send({"status":"200","response":"email already exist"})
      }else{
        res.status(200).send(err)
      }

    }else{
      if(rows!=''){
        var uid = rows.insertId
        jwt.sign({ id: rows.insertId }, process.env.USER_JWT_SECRET_KEY, function(err,token){
          //console.log(token);
          if(err){
            //console.log(err)
          }
          
          // connection.query('UPDATE `users` SET `token`="'+token+'" WHERE `user_id`='+uid+'',async (err, rows, fields) => {
          //   if(err){
          //     //console.log("error"+err)
          //   }else{
          //     //console.log(["update token", rows])
          //   }
          // })
          res.send({"response":"successfully created","user_id":rows,"user_email":rows.insertId ,"token":token,"redirect_url":"http://localhost:3000/"})
        });
      
        
      }



    }
  })
  // res.redirect("http://localhost:3000/")
  
  // res.render('index',{userinfo:req.user})
})



app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))


app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/log')
  }
)

app.get('/auth/logout', (req, res) => {
  // req.logout()
  // res.redirect('/')
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/auth_with_google');
  });
})






app.listen(8888, () => {
  console.log(`server is running at ${process.env.SERVERPORT}`);
});
