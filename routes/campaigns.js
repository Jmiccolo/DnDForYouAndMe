var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	Item = require("../models/item"),
	Armour = require("../models/armour"),
	Note = require("../models/Note"),
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
	Campaign.findById(req.params.CampaignId).populate("characters").populate("notes").exec (function(err, campaign){
		if (err){
			console.log(err);
			res.redirect("back")
		}else{
			
			res.render("campaign/notes", {campaign:campaign})}
		});
	});
router.post("/notes", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			req.flash("error", "The pigeon died on its way");
			res.redirect()
		}else{
			Note.create(req.body.Note, function(err, note){
				if(err){
					console.log(err);
					req.flash("error", "The pigeon died on its way");
				}else{
				note.User = req.user.username;
				note.save();
				campaign.notes.push(note);
				campaign.save();
				res.redirect("back");
			}})
		}
	})
}
)

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