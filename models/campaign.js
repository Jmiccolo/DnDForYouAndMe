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
});

module.exports = mongoose.model("Campaign", CampaignSchema);