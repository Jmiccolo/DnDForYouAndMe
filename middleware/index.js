var Campaign = require("../models/campaign");
var Character = require("../models/character");
var User = require("../models/user")

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampaignUsers = function(req, res, next) {
 if(req.isAuthenticated()){
        Campaign.findById(req.params.CampaignId, function(err, campaign){
           if(err){
               res.redirect("back");
           } else {
               // does user own or use campaign?
            if(campaign.creator.id.equals(req.user.id)){
                next();
            }else if (campaign.users.some(function(user){
                return user._id = req.user._id
               })){
                   next();
               }
             else{
                req.flash("error", "You aren't part of that campaign!")
                res.redirect("/" + req.user._id + "/campaigns/");
            }
        }});}   else {
        res.redirect("back");
    }
}

middlewareObj.checkCharacterOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Character.findById(req.params.CharacterId, function(err, foundCharacter){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundCharacter.creator.id.equals(req.user._id)) {
                next();
            }  else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCampaignOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campaign.findById(req.params.CampaignId, function(err, foundCampaign){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundCampaign.creator.id.equals(req.user._id)) {
                next();
            }  else {
                req.flash("error", "You Shall Not PASS!")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You Shall Not PASS!")
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in!")
    res.redirect("/");
}

module.exports = middlewareObj