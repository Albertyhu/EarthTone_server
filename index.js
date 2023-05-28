const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const mainRoute = require('./route.js'); 
const path = require('path')
const createError = require("http-errors"); 

require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SK); 

var corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    optionsSuccessStatus: 200
}

app.set('views', __dirname + '/view'); 
app.set("view engine", "ejs");

app.use(cors(corsOptions)); 

app.use(express.static(path.join(__dirname, "public")));
 
app.use(express.json()); 

app.use(express.urlencoded({ extended: false }));

app.use('/', mainRoute); 

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT_NUMBER, function(){
    console.log(`CORS-enabled web server listening on port ${process.env.PORT_NUMBER}`)
})