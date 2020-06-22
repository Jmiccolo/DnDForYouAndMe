var mongoose = require("mongoose");

var StrengthSchema = new mongoose.Schema({
	Value: Number,
	Save: Boolean,
	Athletics: Boolean
}),

DexSchema = new mongoose.Schema({
	Value: Number,
	Save: Boolean,
	Acrobatics: Boolean,
	Slieght: Boolean,
	Stealth: Boolean
}),

ConstSchema = new mongoose.Schema( {
	Value: Number,
	Save: Boolean,
}),

IntelSchema = new mongoose.Schema({
	Value: Number,
	Save: Boolean,
	Arcana: Boolean,
	History: Boolean,
	Investigation: Boolean,
	Nature: Boolean,
	Religion: Boolean}),

WisSchema = new mongoose.Schema({Value: Number,
	Value: Number,
	Save: Boolean,
	AnimalHandling: Boolean,
	Insight: Boolean,
	Medicine: Boolean,
	Perception: Boolean,
	Survival: Boolean}),

CharisSchema = new mongoose.Schema({Value: Number,
	Value: Number,
	Save: Boolean,
	Deception: Boolean,
	Intimidation: Boolean,
	Performance: Boolean,
	Persuasion: Boolean}),

AttributeSchema = new mongoose.Schema( {
	Strength:StrengthSchema,
	Dexterity:DexSchema,
	Constitution:ConstSchema,
	Intelligence:IntelSchema,
	Wisdom:WisSchema,
	Charisma:CharisSchema
});

var CharacterSchema = new mongoose.Schema({
    creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	Name:String,
	Age:Number,
	Class:String,
	Race:String,
	Deity:String,
	Image:String,
	Background:String,
	Level:Number,
	Alignment:String,
	Description:String,
	Weapons: [{type: mongoose.Schema.Types.ObjectId, ref:"Weapon"}],
	Items:[{type: mongoose.Schema.Types.ObjectId, ref:"Item"}],
	Armour:[{type: mongoose.Schema.Types.ObjectId, ref:"Armour"}],
	Money: Number,
	Attributes: AttributeSchema,
	Proficiency:Number
});
	module.exports = mongoose.model("Character", CharacterSchema);