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
                res.redirect("back");
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = middlewareObj