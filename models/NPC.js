var mongoose = require("mongoose");

var NPCSchema = new mongoose.Schema({
    Name:String,
    Image: String,
    Description: String,
    HP:Number,
    AC:Number,
    Speed:Number,
    Location:{type:mongoose.Schema.Types.ObjectId, ref:"Location"},
    Hidden:Boolean
});


module.exports = mongoose.model("NPC", NPCSchema)