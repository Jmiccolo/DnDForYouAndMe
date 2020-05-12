var express = require("express");
var router = express.Router();
var Campaign = require("../models/campaign");
var Character = require("../models/character")
var helper = require("../public/helper")

// Show campaing landing page
router.get("/:id", function(req, res){
	Campaigns.findbyId(req.params.id).populate("characters").exec(function(err, foundCampaign){
		if(err){
			console.log(err);
		} else{
			res.render("campaign/show", {campaign:foundCampaign});
		}
	});
})

module.exports = router;