var mongoose = require("mongoose");

var TownSchema = new mongoose.Schema ({
    Name: String,
    Image: String,
    Locations:[{type: mongoose.Schema.Types.ObjectId, ref:"Location"}],
    Description: String,
    Hidden:Boolean
})

module.exports = mongoose.model("Town", TownSchema);