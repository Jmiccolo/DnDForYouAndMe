var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campaign = require("./models/campaign"),
	User = require("./models/user"),
	Character = require("./models/character"),
	SeedDB = require("./seed"),
	helper = require("./public/helper")
	
// 	require routes
// var indexRoutes = require("./routes/index"),
	// gameRoutes = require("./routes/game"),
	// characterRoutes = require("./routes/characters")


// connect app
mongoose.connect("mongodb://localhost/DnDForYouAndMe", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "This is a Secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	next();
});

// Run Routes
// app.use("/", indexRoutes);
// app.use("/game", gameRoutes);
// app.use("/characters", characterRoutes);

// Index Routes
// landing page route
app.get("/", function(req, res){
	res.render("landing");
});


app.post("/login", passport.authenticate("local",{failureRedirect:"/"}),
function(req, res){
	res.redirect("/"+ req.user.id +"/campaigns")
}
);

app.get("/register", function(req, res){
	res.render("register");
})

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/"); 
        });
    });
});


// CAMPAIGN ROUTES
// Index
app.get("/:UserId/campaigns", function(req, res){
		User.findById(req.params.UserId, function(err, user){
			if(err){
				res.redirect("/");
			} else {
			res.render("campaign/index", {user:user});
			}
	});
});

// New Campaign Route
app.get("/:UserId/campaigns/new", function(req, res){
	User.findById(req.params.UserId, function(err, user){
		if (err){
			res.redirect("/:UserId/campaigns");
		} else{
			res.render("campaign/new", {user:user});
		}
	});
});

// New Campaign Post Route
app.post("/:UserId/campaigns", function(req, res){
	User.findById(req.params.UserId, function(err, user){
		if (err){
			console.log(err);
			res.redirect("back");
		} else {	
			Campaign.create(req.body.campaign, function (err, campaign){
			if(err){
				console.log(err);
				res.redirect("/" + user._id +"/campaigns/new")
			} else {campaign.user.id = req.user._id;
				campaign.user.username = req.user.username;
				//save comment
				campaign.save();
				user.campaigns.push(campaign);
				user.save();
				console.log(campaign);
				res.redirect("/campaigns/" + campaign._id)
			}
		});
	}
	});
});

app.get("/campaigns/:CampaignId", function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("campaign/show", {campaign:campaign})}
		});
});

// Character index by campaign
app.get("/campaigns/:campaignId/characters", function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/index", {campaign:campaign})}
		});
})

app.get()
app.listen(3000, function(){
	console.log("Server Started");
});

