var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	aws = require("aws-sdk"),
	dotenv = require("dotenv").config(),
    multer = require("multer"),
    multerS3 = require("multer-s3"),
	fs = require("fs"),
	passport = require("passport"),
	flash = require("connect-flash"),
	{google} = require("googleapis"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	session = require("express-session"),
	MongoStore = require("connect-mongo")(session),
	Campaign = require("./models/campaign"),
	User = require("./models/user"),
	Character = require("./models/character"),
	Weapon = require("./models/weapon"),
	Armour = require("./models/armour"),
	Town = require("./models/town"),
	Note = require("./models/Note"),
	Location = require("./models/location"),
	NPC = require("./models/NPC"),
	middleware = require("./middleware"),
	seedWeapons = require("./models/WeaponsSeed"),
	seedArmour = require("./models/SeedArmour");

// 	require routes
	var indexRoutes = require("./routes/index");
	var gameRoutes = require("./routes/game");
	var campaignRoutes = require("./routes/campaigns");
	var characterRoutes = require("./routes/characters");
	var userRoutes = require("./routes/user");
	var storyRoutes = require("./routes/story");
	var weaponRoutes = require("./routes/weapon");

const oauth2Client = new google.auth.OAuth2(
	process.env.client_id,
	process.env.client_secret, 
	process.env.redirect_uris
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
// to be introduced in the future
const scopes = [
  'https://www.googleapis.com/auth/documents'
];

const Authurl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

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
app.use(flash());

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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.playCharacter = req.session.playCharacter;
   res.locals.campaignSession = req.session.campaignSession;
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
app.use("/campaigns/:CampaignId", campaignRoutes);
app.use("/campaigns/:CampaignId/characters", characterRoutes);
app.use("/:UserId", userRoutes);
app.use("/campaigns/:CampaignId/story", storyRoutes);
app.use("/campaigns/:CampaignId/weapons", weaponRoutes);

app.get("/DNDAPI/testpage", function(req, res){
	res.render("DNDAPI/testpage")
})
app.get("/google/testpage", function(req, res){
	res.redirect(Authurl);
})


app.listen(process.env.PORT||3000, process.env.IP, function(){
	console.log("Server Has Started!");
});
