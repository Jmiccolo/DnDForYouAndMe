var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	Character = require("./models/character"),
	SeedDB = require("./seed"),
	helper = require("./public/helper")
	
// 	require routes
var indexRoutes = require("./routes/index"),
	gameRoutes = require("./routes/game"),
	characterRoutes = require("./routes/characters")


// connect app
mongoose.connect("mongodb://localhost/DnDForYouAndMe", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// SeedDB();

// Run Routes
app.use("/", indexRoutes);
app.use("/game", gameRoutes);
app.use("/characters", characterRoutes);

app.listen(3000, function(){
	console.log("Server Started");
});

