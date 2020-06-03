var mongoose = require("mongoose");

var AttributeSchema = new mongoose.Schema ({
    Strength: Number,
    Dexterity: Number,
    Constitution: Number,
    Intelligence: Number,
    Wisdom: Number,
    Charisma: Number, 
}, {_id:false});

var CharacterSchema = new mongoose.Schema({
    creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	Name:String,
    Race:String,
	Class:String,
	Deity:String,
	Image:String,
	Age:Number,
	Background:String,
	Level:Number,
	Alignment:String,
	Description:String,
	Weapons: [{type: mongoose.Schema.Types.ObjectId, ref:"Weapon"}],
	Money: Number,
	Attributes: AttributeSchema
});

module.exports = mongoose.model("Character", CharacterSchema);