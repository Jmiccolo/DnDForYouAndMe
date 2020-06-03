var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
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

	for(let [key, value] of Entries){
		if (value.instance === "String" && key !== "Image" && key !== "creator.username"){
			console.log(key)
		}
	}
	Campaign.findById(req.params.CampaignId).populate("weapons").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/new", {campaign:campaign, Entries:Entries, CharItems:CharItems})}
		});
});

// Create character post
router.post("/", middleware.checkCampaignUsers, upload.single("charAv"), function(req, res, next){
	var Image = ("https://dndforyouandme.s3.amazonaws.com/" + req.file.key)
	console.log(req.body.weapons);
	var allweapons = [];
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
					if(req.body.weapons){
					req.body.weapons.forEach(function(weapon){
						Weapon.findById(weapon, function (err, foundWeapon){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								console.log(foundWeapon)
								allweapons.push(foundWeapon)
						}})})};
						Character.create(req.body.character, function(err, character){
						if(err){
							console.log(err);
							res.redirect("back");
						} else {
							console.log(allweapons)
							character.Weapons = allweapons
							character.Image = Image;
							character.Attributes = req.body.Attributes;
							character.creator.id = req.user._id;
							character.creator.username = req.user.username;
							character.save();
							campaign.characters.push(character);
							campaign.save();
							user.characters.push(character);
							user.save();
							console.log(character);
							res.redirect("/campaigns/"+ req.params.CampaignId)	
							}})
					}
				})
			}
		})
	});
// character show route
router.get("/:CharacterId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId).populate("Weapons").exec(function(err, character){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					res.render("characters/show", {campaign:campaign, character:character})
				}
			});
		}
	});
})
// character edit route
router.get("/:CharacterId/edit", middleware.checkCharacterOwnership, function(req, res){
	var CharItems = Character.schema.paths;
	Campaign.findById(req.params.CampaignId).populate("weapons").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId).populate("Weapons").exec(function(err, character){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					res.render("characters/edit", {campaign:campaign, character:character, CharItems:CharItems})
				}
			});
		}
	});
})

// Put route character Edit
router.put("/:CharacterId", middleware.checkCharacterOwnership, function(req, res){
		var allweapons = []
		console.log(req.body.Attributes)
		if(req.body.weapons){		
			req.body.weapons.forEach(function(weapon){
			Weapon.findById(weapon, function (err, foundWeapon){
				if (err){
					console.log(err);
					res.redirect("back")
				}else{
					allweapons.push(foundWeapon)
			}})})};
	Character.findByIdAndUpdate(req.params.CharacterId, req.body.character, function(err, updatedCharacter){
		if(err){
			console.log(err); 
			res.redirect("back");
		}else{
		 	updatedCharacter.Weapons = allweapons;
			updatedCharacter.markModified("updatedCharacter.Weapons");
			updatedCharacter.Attributes=req.body.Attributes;
			updatedCharacter.markModified("updateCharacter.Attributes");
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
					if(req.session.playId === false){
						req.session.playName = character.Name;
						req.session.playId = req.params.CharacterId;
						res.redirect("back")
					} else{
						req.session.playName = false;
						req.session.playId = false;
						res.redirect("back")
					}
				}
	})
}})
})


module.exports = router;