var express = require("express");
var router = express.Router();
Profile = require("./model/profile");
var RandomToken = require("random-token").create("abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&");



router.get("/register", function(req, resp){

    resp.render("register",
        {
            title: "Register"
        });

});



router.post('/register', function(req, resp){

    var id = req.body.id;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var shop_name = req.body.shop_name;
    var addressProvince = req.body.addressProvince;
    var addressCity = req.body.addressCity;
    var addressDistrict = req.body.addressDistrict;
    // var gps_lat = req.body.lat;
    // var gps_lng = req.body.lng;
    var email = req.body.email;
    var password = req.body.password;
    // var password_confirmation = req.body.password_confirmation;
    var token = RandomToken(32);


    //req.checkBody('fname' , 'First Name is required').notEmpty();
    //req.checkBody('lname' , 'Last Name is required').notEmpty();
    //req.checkBody('shop_name' , 'Shop Name is required').notEmpty();
    //req.checkBody('addressProvince' , 'Address Province Name is required').notEmpty();
    //req.checkBody('addressCity' , 'Address City is required').notEmpty();
    //req.checkBody('addressDistrict' , 'Address District is required').notEmpty();
    req.checkBody('email' , 'Email is required').notEmpty();
    req.checkBody('password' , 'password is required').notEmpty();
    //req.checkBody('password_confirmation' , 'password confirm is required').notEmpty();

    console.log("Enter");

    var errors = req.validationErrors();
    if (errors) {
        resp.render('register.pug' , {
            title : 'Register',
            errors : errors,
            fname : fname,
            lname : lname,
            shop_name : shop_name,
            addressProvince : addressProvince,
            addressCity : addressCity,
            addressDistrict : addressDistrict,
            email : email
        });
        console.log("Input Error");
        resp.send("Input Error");
        return;
    }
    
    var newProfile = new Profile({
        token : token,
        fname : fname,
        lname : lname,
        shop_name : shop_name,
        addressProvince : addressProvince,
        addressCity : addressCity,
        addressDistrict : addressDistrict,
        email: email,
        password: Profile.generateHash(password)
    });

    newProfile.save(function(err){
        // if (err) {
        //     console.log("DB ERROR");
        //     resp.status(403).send("DB ERROR!!!");
        //     return;
        // }
        console.log("DB OK");
        resp.send("OK")
        //resp.send(JSON.stringify({token:newProfile.token}));
        return;
    });
    console.log("??????");
    
});



router.get("/login/:login", function(req, resp){

    if (req.params.login === 'up'){
        resp.render("login", {});
    }

    else if (req.params.login === 'tkn'){
        resp.render("login_token", {});
    }

    else{
        resp.status(404).send("Page not Found");
    }

});



router.post("/login/up", function(req, resp){

    var email = req.body.email;
    var password = req.body.password;

    req.checkBody('email' , 'The email field is required').notEmpty();
    req.checkBody('email' , 'The email must be a valid email adress').isEmail();
    req.checkBody('password' , 'The password field is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors)
        resp.status(403).send("Input Error");
        return;
    }

    Profile.findOne({email:email}, function(err, user){

        if (err)
            console.log(err);

        if (!user){
            resp.status(403).send("User not Found");
            return;
        }

        if (Profile.validPassword(password, user.password)){
            var token = RandomToken(32)
            user.token = token;
            resp.send(JSON.stringify({token:user.token}));
            user.save(function(err) {
                if(!err) {
                    console.log("updated");
                }
                else {
                    console.log("update error");
                }
            });
        }
        else {
            resp.status(403).send("Password Error");
            return;
        }

    });


});



router.post("/login/tkn", function(req, resp){
    
    var token = req.body.token;

    req.checkBody('token' , 'The token field is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        console.log("input error");
        resp.status(403).send("Input Error");
        return;
    }

    Profile.findOne({token:token}, function(err, user){
        if (err)
            console.log(err);

        if (!user){
            resp.status(403).send("User not Found");
            return;
        }
        
        resp.send(JSON.stringify({password:user.password}));

    });

});


module.exports = router;