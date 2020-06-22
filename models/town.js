var mongoose = require("mongoose");

var TownSchema = new mongoose.Schema ({
    Name: String,
    Image: String,
    Locations:[{type: mongoose.Schema.Types.ObjectId, ref:"Location"}],
    NPCs:[{type: mongoose.Schema.Types.ObjectId, ref:"NPC"}],
    Description: String,
    Hidden:Boolean
})

module.exports = mongoose.model("Town", TownSchema);