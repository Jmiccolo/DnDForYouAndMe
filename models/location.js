var mongoose = require("mongoose");

var LocationSchema = new mongoose.Schema ({
    Name: String,
    Weapons:[{type: mongoose.Schema.Types.ObjectId, ref:"Weapon"}],
    Items: [{type: mongoose.Schema.Types.ObjectId, ref:"Item"}],
    Armour:[{type: mongoose.Schema.Types.ObjectId, ref:"Armour"}],
    NPCs:[{type:mongoose.Schema.Types.ObjectId, ref:"NPC"}],
    Description: String,
    Hidden:Boolean,
})

module.exports = mongoose.model("Location", LocationSchema);