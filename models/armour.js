var mongoose = require("mongoose");

var ArmourSchema = new mongoose.Schema({
    Name: String,
    Weight: Number,
    Cost: Number,
    Class: Number,
    DexMod: Boolean,
    ifStrength:Boolean,
    Strength:Number,
})

module.exports = mongoose.model("Armour", ArmourSchema);