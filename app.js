var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	aws = require("aws-sdk"),
    multer = require("multer"),
    multerS3 = require("multer-s3"),
    fs = require("fs"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	session = require("express-session"),
	MongoStore = require("connect-mongo")(session),
	Campaign = require("./models/campaign"),
	User = require("./models/user"),
	Character = require("./models/character"),
	Weapon = require("./models/weapon"),
	SeedDB = require("./seed"),
	middleware = require("./middleware"),
	seedWeapons = require("./models/WeaponsSeed")

// 	require routes
	var indexRoutes = require("./routes/index");
	var gameRoutes = require("./routes/game");
	var campaignRoutes = require("./routes/campaigns");
	var characterRoutes = require("./routes/characters");
	var userRoutes = require("./routes/user")
	var storyRoutes = require("./routes/story");


// connect app
var url = process.env.DATABASEURL || "mongodb://localhost/DnDForYouAndMe";
mongoose.connect(url, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});
// middleware use
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// session use
app.use(session({
    secret: "This is a Secret!",
    resave: false,
	saveUninitialized: false,
	store: new MongoStore({url:process.env.DATABASEURL})
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.playName = req.session.playName;
   res.locals.playId = req.session.playId;
	next();
});


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

// define Routes
app.use("/", indexRoutes);
app.use("/", gameRoutes);
app.use("/campaigns/:CampaignId", campaignRoutes)
app.use("/campaigns/:CampaignId/characters", characterRoutes);
app.use("/:UserId", userRoutes);
app.use("/campaigns/:CampaignId/story", storyRoutes);

// Seed weapons
 seedWeapons();

// Index Routes
// landing page route
app.get("/campaigns/:CampaignId/story/weapons", function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
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
app.put("/campaigns/:CampaignId/story/weapons", function(req, res){
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
						console.log(campaign);
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
					Character.findById(req.session.playId, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							character.Weapons.push(weapon);
							character.Money -= weapon.Cost;
							character.save();
							res.redirect("/campaigns/"+req.params.CampaignId+"/characters/"+req.session.playId)
						}
					})
				}
			})
		}
	})


		app.listen(process.env.PORT||3000, process.env.IP, function(){
			console.log("Server Has Started!");
		 });

