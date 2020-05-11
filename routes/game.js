var express = require("express");
var router = express.Router();
var helper = require("../public/helper");
var Character = require("../models/character")


	
router.get("/statistics", function (req, res){
	res.render("games/statistics", {helper:helper})
});

router.get("/dice", function (req, res){
	res.render("games/dice")
	});


		
module.exports = router;