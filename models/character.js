var mongoose = require("mongoose");

var CharacterSchema = new mongoose.Schema({
    creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	name:String,
    race:String,
	class:String,
	deity:String,
	image:String,
	age:Number,
	background:String,
	level:Number,
	alignment:String,
	description:String,
	equipment:String,
	
});

module.exports = mongoose.model("Character", CharacterSchema);