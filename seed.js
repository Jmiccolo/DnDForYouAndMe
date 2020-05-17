var mongoose = require("mongoose")
var User = require("./models/user")
var Character = require("./models/character")
var Campaign = require("./models/campaign")
var helper = require("./public/helper")

// Ilin- image https://i.pinimg.com/originals/23/ed/46/23ed46e63a1eb1d71d02538a00fb0e28.png
// harik- image https://i.pinimg.com/originals/4f/dd/de/4fddde3834e687af5dfafa6902751855.jpg


function SeedDB(){
	User.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Removed Users")
		}
	});
	Character.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Removed Characters");
		} 
		Campaign.users.forEach(seed, function(err, user){
			if(err){
				console.log(err);
			}else{
				User.create(campaign, function(err, campaign){
			if(err){
				console.log(err);
			} else{
				console.log("campaign created");
				user.save();
			}
		Campaign.characters.forEach
		});
			}
		});
	});
}
// create campaigns
	// create usernames; 
		

// create dice roll values
					   
 module.exports = SeedDB;