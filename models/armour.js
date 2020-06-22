var mongoose = require("mongoose");

var ArmourSchema = new mongoose.Schema({
    Name: String,
    Type: String,
    Weight: Number,
    Cost: Number,
    Class: Number,
    Stealth:Boolean,
    DexMod: Boolean,
    ifStrength:Boolean,
    Strength:Number,
    Hidden:Boolean,
    Inventory:Number,
    Donned:Boolean
});

module.exports = mongoose.model("Armour", ArmourSchema);