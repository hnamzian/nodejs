var express = require("express");
var router = express.Router();
var Invoice = require("./model/invoice");
var dateTime = require('node-datetime');
var dt = dateTime.create();
dt.format('m/d/Y H:M:S');



router
    .get("/", function(req, resp){
        resp.send("GET");
    })

    .post("/", function(req, resp){
        var currDate = new Date(dt.now());
        var invoices = req.body.Invoices;
        var user_token = req.header.token;
        console.log(req.headers);
        for (key in invoices)
            {
                var newInvoice = new Invoice(invoices[key]);
                newInvoice.LastUpdatedServer = currDate;
                newInvoice.user_token = user_token;
                
                newInvoice.save(function(err){
                    if (err) {
                        resp.status(403).send(err);
                        return;
                    }
                });
            } 
        resp.send(JSON.stringify({LastUpdatedServer:currDate}));       
    })

    .put("/", function(req, resp){
        resp.json(req.body);
    })

    .delete("/", function(req, resp){
        resp.send("DELETE");
    })





module.exports = router;