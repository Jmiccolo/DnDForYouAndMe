var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	Item = require("../models/item"),
	Armour = require("../models/armour"),
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

// CAMPAIGN ROUTES
// Campaign Show Route
router.get("/", middleware.checkCampaignUsers, function(req, res){
Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
    if (err){
		console.log(err);
		res.redirect("back")
    }else{
        res.render("campaign/show", {campaign:campaign})}
    });
});

router.get("/notes", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
			res.redirect("back")
		}else{
			res.render("campaign/notes", {campaign:campaign})}
		});
	});

router.put("/notes", middleware.checkCampaignUsers, function(req, res){
	Campaign.findByIdAndUpdate(req.params.CampaignId, req.body.campaign, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			campaign.save();
			res.redirect("back")
		}
		});
});

module.exports = router;