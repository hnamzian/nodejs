var express = require("express");
app = express();
var dashboard = require("./dashboard");
var sync = require("./sync");
var bodyParser = require("body-parser");
var expressVlidator = require("express-validator");
var mongoose = require("mongoose");
var fs = require("fs");
var dateTime = require('node-datetime');
var dt = dateTime.create();
dt.format('m/d/Y H:M:S');


app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressVlidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


// Create a new database or uses the database
// mongoose.connect("mongodb://localhost/retail");


// var config = JSON.parse(process.env.APP_CONFIG);
// var mongouser = '57a51c6fe4b2c995a19817e658088dd6';
// var mongoPassword = '123';
// var hostString = "mongodb:27017/57a51c6fe4b2c995a19817e658088dd6";

var mongouser = 'hossein';
var mongoPassword = '123';
var hostString = "mongodb:27017/retaiil";

var MongoClient = require('mongodb').MongoClient;
var URI = "mongodb://" + mongouser + ':' + mongoPassword + '@' + hostString;

// MongoClient.connect(URI, function(err, db) {
//     if(!err) {
//       console.log("We are connected to MongoDB\n");
//     } else {
//         console.log("Error while connecting to MongoDB\n");
//     }
//   }
// );
console.log(URI);
mongoose.connect(URI, {useMongoClient:true});






app.use("/dashboard", dashboard);

//app.use("/sync", sync);

app.get("/", function(req, resp){

    resp.send("Main Page");

});


// app.listen(process.env.PORT,"0.0.0.0", function(){
app.listen(80, function(){
    console.log(new Date(dt.now()));
    console.log("Server is running at localhost:80");
});