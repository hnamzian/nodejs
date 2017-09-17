var express = require("express");
var body_parser = require("body-parser");
var couchbase = require("couchbase");

var cluster = new couchbase.Cluster("couchbase://localhost");
var bucket = cluster.openBucket("default");

app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded( {extended:true} ));

app.get("/person/:id", function(req, resp){
        bucket.get(req.params.id, function(error, result){
            if (error){
                resp.status(400).send(error);
            }
            console.log(result);
            return resp.send(result);
        });
    })

app.post("/person/:id", function(req, resp){
    var document = {
        firstName: req.body.fname,
        lastName: req.body.lname
    };
    bucket.upsert(req.params.id, document, function(error, result){
        if (error){
            resp.status(400).send(error);
        }
        return resp.send(result);
    });
});


var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port);
});


