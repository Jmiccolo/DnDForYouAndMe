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
	helper = require("./public/helper"),
	middleware = require("./middleware")

	
// 	require routes
// var indexRoutes = require("./routes/index"),
	var gameRoutes = require("./routes/game");
	// characterRoutes = require("./routes/characters")


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
app.use("/", gameRoutes);
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
           res.redirect("/" +req.user._id+"/campaigns"); 
        });
    });
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
 });
 
// User Profile Page 
app.get("/:UserId", function(req, res){
	User.findById(req.params.UserId).populate("campaigns").populate("characters").exec(function(err, user){
		if(err){
			res.redirect("/")
		}else{
			res.render("user/index",{user:user})
		}
	})
})
// CAMPAIGN ROUTES
// Index
app.get("/:UserId/campaigns", middleware.isLoggedIn, function(req, res){
		User.findById(req.params.UserId).populate("campaigns").exec(function(err, user){
			if(err){
				res.redirect("/");
			} else {
			res.render("campaign/index", {user:user});
			}
	});
});

// New Campaign Route
app.get("/:UserId/campaigns/new", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.UserId, function(err, user){
		if (err){
			res.redirect("/:UserId/campaigns");
		} else{
			res.render("campaign/new", {user:user});
		}
	});
});

// Create Campaign Post Route
app.post("/:UserId/campaigns", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.UserId, function(err, user){
		if (err){
			console.log(err);
			res.redirect("back");
		} else {	
			Campaign.create(req.body.campaign, function (err, campaign){
			if(err){
				console.log(err);
				res.redirect("/" + user._id +"/campaigns/new")
			} else {campaign.creator.id = req.user._id;
				campaign.creator.username = req.user.username;
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

// Join Campaign Put route
app.put("/:UserId/campaigns", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.UserId, function(err, user){
		if(err){
			console.log(err);
			res.redirect("back")
		}
		else {
			Campaign.findById(req.body.id, function(err, campaign){
				if(err || req.body.password !== campaign.password){
					console.log(err)
					res.redirect("back");
				}else {
					user.campaigns.push(campaign);
					user.save();
					campaign.users.push(user);
					campaign.save();
					console.log("/campaigns/" + campaign.id)
					res.redirect("/campaigns/" + campaign.id)
				}
			})
		}
	});
});


app.get("/campaigns/:CampaignId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("campaign/show", {campaign:campaign})}
		});
});

// Character index by campaign
app.get("/campaigns/:CampaignId/characters", middleware.checkCampaignUsers,  function(req, res){
	Campaign.findById(req.params.CampaignId).populate("characters").exec (function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/index", {campaign:campaign})}
		});
});

app.get("/campaigns/:CampaignId/characters/new", middleware.checkCampaignUsers, function (req, res){
	var CharItems = Character.schema.paths;

	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if (err){
			console.log(err);
		}else{
			res.render("characters/new", {campaign:campaign, CharItems:CharItems})}
		});
});

// Create character post
app.post("/campaigns/:CampaignId/characters", middleware.checkCampaignUsers, function(req, res){
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
						console.log(req.body.Attributes)
					Character.create(req.body.character, function(err, character){
					if(err){
						console.log(err);
						res.redirect("back");
					} else {
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
				}
			})
			
				}
			})
		}
	})
})
// character show route
app.get("/:CampaignId/characters/:CharacterId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId, function(err, character){
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
app.get("/:CampaignId/characters/:CharacterId/edit", middleware.checkCharacterOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Character.findById(req.params.CharacterId, function(err, character){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					res.render("characters/edit", {campaign:campaign, character:character})
				}
			});
		}
	});
})

// Put route character Edit
app.put("/:CampaignId/characters/:CharacterId", middleware.checkCharacterOwnership, function(req, res){
	Character.findByIdAndUpdate(req.params.CharacterId, req.body.character, function(err, updatedCharacter){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			updatedCharacter.Attributes=req.body.Attributes;
			updatedCharacter.markModified("updateCharacter.Attributes");
			updatedCharacter.save();
			res.redirect("/"+req.params.CampaignId +"/characters/" +req.params.CharacterId)
		}
			});
		});

app.delete("/:CampaignId/characters/:CharacterId", middleware.checkCharacterOwnership, function(req, res){
	Character.findByIdAndRemove(req.params.CharacterId, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/campaigns/"+req.params.CampaignId +"/characters/")
		}
			});
		});




app.listen(3000, function(){
	console.log("Server Started");
});

