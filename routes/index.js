var express = require("express"),
	app = express(),
	router = express.Router({mergeParams:true}),
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
	User = require("../models/user")




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

router.get("/", function(req, res){
	res.render("landing");
});

router.post("/login", passport.authenticate("local", {failureRedirect: "/"}), function(req, res){
	res.redirect("/" + req.user._id +"/campaigns");
});

router.get("/register", function(req, res){
	res.render("register");
})

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/"+req.user._id+"/campaigns"); 
        });
    });
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
 });

module.exports = router;