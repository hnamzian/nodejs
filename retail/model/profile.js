var mongoose = require("mongoose");
bcrypt = require("bcrypt-nodejs");



profileSchema = mongoose.Schema({
    token: String,
    fname: String,
    lname: String,
    shop_name: String,
    addressProvince: String,
    addressCity: String,
    addressDistrict: String,
    worker_id: String,
    email: {type: String, require: true, unique:true},
    password: {type: String, require: true},
    created_at: Date,
    updated_at: Date
});


profileSchema.pre("save", function(next){

    var currentDate = new Date();

    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();

});


var Profile = mongoose.model("Profile", profileSchema);



module.exports = Profile;

module.exports.generateHash = function(password){

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

};

module.exports.validPassword = function(password, hash){

    return bcrypt.compareSync(password, hash);

};





