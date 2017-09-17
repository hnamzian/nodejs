var mongoose = require("mongoose");


invoiceItem = mongoose.Schema({
    product_Id: String,
    counts: String,
    price: String,
    discount: String
});

invoiceSchema = mongoose.Schema({
    user_token: String,
    Salesman_Id: String,
    Shop_Id: String,
    Invoice_date: Date,
	Invoice_Id: String,
	Invoice_Number: String,
	Total_price: String,
    Modification_Type: String,
    items: [invoiceItem],
    LastUpdatedClient: Date,
    LastUpdatedServer: Date
});

invoiceSchema.pre("save", function(next){
    var currentDate = new Date();
    
    this.updated_at = currentDate;
    
    if (!this.created_at)
        this.created_at = currentDate;
    
    next();
});

var Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;