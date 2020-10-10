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
    aws = require("aws-sdk"),
    standardWeapons = require("../models/WeaponsSeed"),
    standardItems = require("../models/seedItems");
    standardArmour = require("../models/SeedArmour");

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

// User Profile Page 
router.get("/", function(req, res){
	User.findById(req.params.UserId).populate("campaigns").populate("characters").exec(function(err, user){
		if(err){
            req.flash("error", "Please log in");
			res.redirect("/")
		}else{
			res.render("user/index",{user:user})
		}
	})
})

// User Campaign Index
router.get("/campaigns", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.UserId).populate("campaigns").exec(function(err, user){
        if(err){
            req.flash("error", "User not Found")
            res.redirect("/");
        } else {
        req.session.playCharacter = false;
        res.render("campaign/index", {user:user});
        }
});
});

// New Campaign Route
router.get("/campaigns/new", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.UserId, function(err, user){
        if (err){
            res.redirect("/campaigns");
        } else{
            res.render("campaign/new", {user:user});
        }
    });
    });
// Create Campaign Post Route
router.post("/campaigns", middleware.isLoggedIn, function(req, res){
    var allweapons = []
    var allitems = []
    var allarmour = []
    User.findById(req.params.UserId, function(err, user){
        if (err){
            req.flash("error", "User not found")
            res.redirect("back");
        } else {
            standardWeapons.forEach(function(seed){
            Weapon.create(seed, function(err, weapon){
                if(err){
                    console.log(err)
                }else{
                        weapon.Hidden = false;
                        allweapons.push(weapon);
                        }
                    })
                })
            standardItems.forEach(function(seed){
            Item.create(seed, function(err, item){
                if(err){
                    console.log(err)
                }else{
                        item.Hidden = false;
                        allitems.push(item);
                        }
                    })
                })
            standardArmour.forEach(function(seed){
            Armour.create(seed, function(err, armour){
                if(err){
                    console.log(err)
                }else{
                        armour.Hidden = false;  
                        allarmour.push(armour);
                        }
                    })
                })
            Campaign.create(req.body.campaign, function (err, campaign){
            if(err){
                console.log(err);
                res.redirect("/" + user._id +"/campaigns/new")
            } else {
                campaign.items = allitems;
                campaign.weapons = allweapons;
                campaign.armour = allarmour;
                campaign.creator.id = req.user._id;
                campaign.creator.username = req.user.username;
                campaign.messages.push({text:"Thank you " + user.username + " for creating this Adventure!", user:user});
                campaign.save();
                user.campaigns.push(campaign);
                user.save();
                req.session.campaignSession = campaign;
                res.redirect("/campaigns/" + campaign._id)
            }
        });
    }
    });
    });
    
    // Join Campaign Put route
    router.put("/campaigns", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.UserId, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/"+ req.params.UserId +"/campaigns")
        }
        else {
            Campaign.findOne({"title":req.body.title}, function(err, campaign){
                if(err ||campaign===null|| req.body.password !== campaign.password){
                    console.log(err)
                    res.redirect("back");
                }else {
                    user.campaigns.push(campaign);
                    user.save();
                    campaign.users.push(user);
                    campaign.save();
                    res.redirect("/campaigns/" + campaign.id)
                }
            })
        }
    });
    });

module.exports = router;