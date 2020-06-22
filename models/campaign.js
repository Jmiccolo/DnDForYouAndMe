var mongoose = require("mongoose");

var CampaignSchema = new mongoose.Schema({
	title:String,
    creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String,
	},
	users: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String,
	}],
	password:String,
	characters: [{type: mongoose.Schema.Types.ObjectId, ref:"Character"}],
	weapons: [{type: mongoose.Schema.Types.ObjectId, ref:"Weapon"}],
	items: [{type: mongoose.Schema.Types.ObjectId, ref:"Item"}],
	armour: [{type: mongoose.Schema.Types.ObjectId, ref:"Armour"}],
	towns: [{type: mongoose.Schema.Types.ObjectId, ref:"Town"}],
	Doc: String
});

module.exports = mongoose.model("Campaign", CampaignSchema);