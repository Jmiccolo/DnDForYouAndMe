var mongoose = require("mongoose")
var User = require("./models/user")
var Character = require("./models/character")
var Campaign = require("./models/campaign")
var helper = require("./public/helper")



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