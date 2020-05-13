var Campaign = require("../models/campaign");
var Character = require("../models/character");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampaignOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campaign.findById(req.params.CampaignId, function(err, foundCampaign){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if((foundCampaign.creator.id||foundCampaign.users.id).equals(req.user.id)) {
                next();
            } else {
              
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCharacterOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Character.findById(req.params.characterId, function(err, foundCharacter){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundCharacter.creator.id.equals(req.user._id)) {
                next();
            } else {
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