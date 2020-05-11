var express = require("express");
var router = express.Router();
var helper = require("../public/helper");
var Character = require("../models/character")

router.get("/", function(req, res){
	Character.find({}, function(err, allCharacters){
		if(err){
			console.log(err);
		} else{
			res.render("characters/index", {characters:allCharacters});
		}
	})
});

module.exports = router;