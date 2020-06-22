var mongoose = require("mongoose");

var ItemSchema = new mongoose.Schema ({
    Name: String,
    Type: String,
    Amount: Number,
    Cost:Number,
    Weight: Number,
    Hidden:Boolean,
    Inventory: Number
})

module.exports = mongoose.model("Item", ItemSchema);