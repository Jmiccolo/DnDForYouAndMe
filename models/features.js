var mongoose = require("mongoose");

var FeatureSchema = new mongoose.Schema({
    Name:String,
    Description:String,
    AttackValue:{Type:String, DieCount:Number, DieType:Number},
    Duration:String,
})