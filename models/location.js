var mongoose = require("mongoose"),
    Weapon = require("./weapon")

var LocationSchema = new mongoose.Schema ({
    Name: String,
    Inventory: {
        Weapons:[{type: mongoose.Schema.Types.ObjectId, ref:"Weapon"}],
        Items: [{type: mongoose.Schema.Types.ObjectId, ref:"Items"}],
        Armour:[{type: mongoose.Schema.Types.ObjectId, ref:"Armour"}]
    },
    Description: String,
})

module.exports = mongoose.model("Location", LocationSchema);