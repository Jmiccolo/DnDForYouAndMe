var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	Item = require("../models/item"),
	middleware = require("../middleware/index"),
	multer = require("multer"),
	multerS3 = require("multer-s3"),
	fs = require("fs"),
	aws = require("aws-sdk")

	var s3 = new aws.S3({aws_access_key_id:process.env.AWS_ACCESS_KEY_ID, aws_secret_access_key:process.env.AWS_SECRET_ACCESS_KEY});

var upload = multer({
  storage: multerS3({
	s3:s3,
	bucket:"dndforyouandme",
	acl:"public-read-write",
	metadata: function (req, file, cb) {
	  cb(null, {fieldName: file.fieldname});
	},
	key: function (req, file, cb) {
	  cb(null, (Date.now()+file.fieldname+file.originalname)) 
	}
  })
})

// Character index by campaign
router.get("/", middleware.checkCampaignUsers,  function(req, res){
	// find campaign and populate characters
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/index", {campaign:campaign})}
		});
});
// New character Route
router.get("/new", middleware.checkCampaignUsers, function (req, res){
	// define Character Object keys
	var CharItems = Character.schema.paths;
	var Entries = Object.entries(CharItems);
	var AttEntries = Object.entries(CharItems.Attributes.schema.paths); 
	Campaign.findById(req.params.CampaignId).populate("weapons").populate("items").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/new", {campaign:campaign, Entries:Entries, CharItems:CharItems, AttEntries:AttEntries})
	}});
});

// Create character post
router.post("/", middleware.checkCampaignUsers, upload.single("charAv"), function(req, res, next){
	var Image = ("https://dndforyouandme.s3.amazonaws.com/" + req.file.key)
	var allweapons = [];
	var allitems = []
	User.findById(req.user.id, function(err,user){
		if (err){
			console.log(err);
			res.redirect("back")
		} else {
			Campaign.findById(req.params.CampaignId, function(err, campaign){
				if(err){
					console.log(err);
					res.redirect("back")
				} else {
					if(typeof req.body.weapons === "string"){
					allweapons.push(req.body.weapons);
					}else{
					req.body.weapons.forEach(function(weapon){
						Weapon.findById(weapon, function (err, foundWeapon){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								allweapons.push(foundWeapon)
						}})})};
					if(typeof req.body.items === "string"){
						allitems.push(req.body.items);
					}else{
					req.body.items.forEach(function(item){
						Item.findById(item, function (err, foundItem){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								allitems.push(foundItem)
						}})})};
						Character.create(req.body.character, function(err, character){
						if(err){
							console.log(err);
							res.redirect("back");
						} else {
							if(req.body.character.Level < 5){
								character.Proficiency = 2;
							}else if(req.body.character.Level < 9){
								character.Proficiency = 3;
							}else if(req.body.character.Level < 13){
								character.Proficiency = 4;
							}else if(req.body.character.Level < 17){
								character.Proficiency = 5;
							}else{
								character.Proficiency = 6;
							};
							character.Items = allitems; 
							character.Weapons = allweapons;
							character.Image = Image;
							character.Attributes = req.body.Attributes;
							character.creator.id = req.user._id;
							character.creator.username = req.user.username;
							character.save();
							campaign.characters.push(character);
							campaign.save();
							user.characters.push(character);
							user.save();
							res.redirect("/campaigns/"+ req.params.CampaignId)	
							}})
					}})
				}})
			}
		);
// character show route
router.get("/:CharacterId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId).populate("Weapons").populate("Items").exec(function(err, character){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					var Entries = Object.entries(character._doc);
					res.render("characters/show", {campaign:campaign, character:character, Entries:Entries})
				}
			});
		}
	});
})
// character edit route
router.get("/:CharacterId/edit", middleware.checkCharacterOwnership, function(req, res){
	var CharItems = Character.schema.paths;
	var Entries = Object.entries(CharItems);
	var AttEntries = Object.entries(CharItems.Attributes.schema.paths); 
	Campaign.findById(req.params.CampaignId).populate("weapons").populate("items").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId).populate("Weapons").populate("Items").exec(function(err, character){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					res.render("characters/edit", {campaign:campaign, character:character, CharItems:CharItems, AttEntries:AttEntries})
				}
			});
		}
	});
})

// Put route character Edit
router.put("/:CharacterId", middleware.checkCharacterOwnership, function(req, res){
		var allweapons = [],
			allitems = []
		if(typeof req.body.weapons === "string"){
			allweapons.push(req.body.weapons);
			}else{
			req.body.weapons.forEach(function(weapon){
				Weapon.findById(weapon, function (err, foundWeapon){
					if (err){
						console.log(err);
						res.redirect("back")
					}else{
						allweapons.push(foundWeapon)
				}})})};
				if(typeof req.body.items === "string"){
					allitems.push(req.body.items);
				}else{
				req.body.items.forEach(function(item){
					Item.findById(item, function (err, foundItem){
						if (err){
							console.log(err);
							res.redirect("back")
						}else{
							allitems.push(foundItem)
					}})})};
	Character.findByIdAndUpdate(req.params.CharacterId, req.body.character, function(err, updatedCharacter){
		if(err){
			console.log(err); 
			res.redirect("back");
		}else{
			if(req.body.character.Level < 5){
				updatedCharacter.Proficiency = 2;
			}else if(req.body.character.Level < 9){
				updatedCharacter.Proficiency = 3;
			}else if(req.body.character.Level < 13){
				updatedCharacter.Proficiency = 4;
			}else if(req.body.character.Level < 17){
				updatedCharacter.Proficiency = 5;
			}else{
				updatedCharacter.Proficiency = 6;
			};
			updatedCharacter.markModified("updatedCharacter.Proficiency")
		 	updatedCharacter.Weapons = allweapons;
			updatedCharacter.markModified("updatedCharacter.Weapons");
			updatedCharacter.Items = allitems;
			updatedCharacter.markModified("updatedCharacter.Items");
			updatedCharacter.Attributes=req.body.Attributes;
			updatedCharacter.markModified("updatedCharacter.Attributes");
			updatedCharacter.save();
			res.redirect("/campaigns/"+req.params.CampaignId +"/characters/" +req.params.CharacterId)
		}})});

// Edit Character Image Route
router.post("/:CharacterId", middleware.checkCharacterOwnership, upload.single("charAv"), function(req, res, next){
	var Image = ("https://dndforyouandme.s3.amazonaws.com/" + req.file.key)
	Character.findById(req.params.CharacterId, function(err, character){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			character.Image = Image;
			character.save();
			res.redirect("back")
		}
	})
})

// DELETE Character Route
router.delete("/:CharacterId", middleware.checkCharacterOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{}
			campaign.characters.pull(req.params.CharacterId);
			campaign.save();
	})
	User.findById(req.user._id, function(err, user){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			user.characters.pull(req.params.CharacterId);
			user.save();
		}
	});
	Character.findByIdAndRemove(req.params.CharacterId, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/campaigns/"+req.params.CampaignId +"/characters/")
		}
			});
		});

// play character route
router.post("/:CharacterId/play", middleware.checkCharacterOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId, function (err, character){
				if(err){
					console.log(err);
					res.redirect("back")
				} else {
					if(req.session.playCharacter !== false){
						req.session.playCharacter = false;
						res.redirect("back")
					} else{
						req.session.playCharacter = character;
						res.redirect("back")
					}
				}
	})
}})
})


module.exports = router;