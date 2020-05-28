var express = require("express");
var router = express.Router();
var helper = require("../public/helper");
var Character = require("../models/character")
var Campaign = require("../models/campaign")
var middleware = require("../middleware");

	
router.get("/campaigns/:CampaignId/statistics", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec(function(err, campaign){
		if(err){
			res.redirect("back")
		} else {
			var CharItems = Character.schema.paths;
			res.render("games/statistics", {helper:helper, campaign:campaign, CharItems:CharItems})
		}
	})

});

router.get("/campaigns/:CampaignId/dice", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec(function(err, campaign){
		if(err){
			res.redirect("back")
		} else {
			res.render("games/dice", {helper:helper, campaign:campaign})
		}
	})

});


		
module.exports = router;