var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	Item = require("../models/item"),
	Town = require("../models/town"),
	Location = require("../models/location"),
	middleware = require("../middleware/index"),
	multer = require("multer"),
	multerS3 = require("multer-s3"),
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

// Story index Route
router.get("/", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("towns").populate("characters").populate("weapons").populate("items").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			res.render("story/index", {campaign:campaign})
		}
	})
})
// New Town Route
router.get("/town/new", middleware.checkCampaignOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("weapons").populate("items").exec(function(err, campaign){
		var townItems = Town.schema.paths;
		var Entries = Object.entries(townItems);
		res.render("story/town/new", {campaign:campaign, Entries:Entries})
	});
});

// Create Town Route
router.post("/town", middleware.checkCampaignOwnership, upload.single("townAv"), function(req, res, next){
	var Image = ("https://dndforyouandme.s3.amazonaws.com/" + req.file.key)
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.create(req.body.town, function(err, newTown){
				newTown.Image = Image;
				console.log(req.body.Hidden);
				newTown.save();
				console.log(newTown)
				campaign.towns.push(newTown);
				campaign.save();
				res.redirect("/campaigns/"+ req.params.CampaignId + "/story");
			})
		}
	})
})
router.get("/weapons", function(req, res){
	Campaign.findById(req.params.CampaignId).populate("weapons").exec(function(err, campaign){
		if(err){
			console.log(err)
		} else{
			Weapon.find(function(err, weapons){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					res.render("story/weapons", {campaign:campaign, weapons:weapons});
				}
			})
		}
	})
})
router.get("/weapons/new")
router.put("/weapons", function(req, res){
	if(req.body.weaponsInput === "save"){
		req.body.weapons.forEach(function(weapon){
			Weapon.findById(weapon, function(err, foundWeapon){
				if(err){
					console.log(err)
				}else{
					Campaign.findById(req.params.CampaignId, function(err, campaign){
						if (err){
							console.log(err)
						}else{
						campaign.weapons.push(foundWeapon);
						campaign.save();
						}
					})
				}
			});
		})
		res.redirect("back")		
		} else {
			Weapon.findById(req.body.weaponsInput, function(err, weapon){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					Character.findById(req.session.playCharacter._id, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							if(character.Money > weapon.Cost){
							character.Weapons.push(weapon);
							console.log(weapon.Cost)
							
							var Money = character.Money - weapon.Cost;
							console.log(Money)
							character.Money = Money;
							character.markModified("character.Money");
							character.save();
							req.session.playCharacter = character;
							req.flash("success", "You have aquired a "+weapon.Name);
							res.redirect("back");
						}else{
							req.flash("error", "Come back when you have more money!")
							res.redirect("back")
						}}
					})
				}
			})
		}
	})

module.exports = router;