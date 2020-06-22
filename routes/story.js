var	express = require("express"),
	router = express.Router({mergeParams:true}),
	mongoose = require("mongoose"),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	Item = require("../models/item"),
	Armour = require("../models/armour"),
	Town = require("../models/town"),
	Location = require("../models/location"),
	NPC = require("../models/NPC"),
	middleware = require("../middleware/index"),
	multer = require("multer"),
	multerS3 = require("multer-s3"),
	aws = require("aws-sdk")

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

// Story index Route
router.get("/", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("towns").populate("characters").populate("weapons").populate("items").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			res.render("story/index", {campaign:campaign})
		}
	})
})
// New Town Route
router.get("/town/new", middleware.checkCampaignOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("weapons").populate("items").exec(function(err, campaign){
		var townItems = Town.schema.paths;
		var Entries = Object.entries(townItems);
		res.render("story/town/new", {campaign:campaign, Entries:Entries})
	});
});

// Create Town Route
router.post("/town", middleware.checkCampaignOwnership, upload.single("townAv"), function(req, res, next){
	console.log(req.body.town)
	var Image = ("https://dndforyouandme.s3.amazonaws.com/" + req.file.key)
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.create(req.body.town, function(err, newTown){
				newTown.Image = Image;
				newTown.save();
				campaign.towns.push(newTown);
				campaign.save();
				res.redirect("/campaigns/"+ req.params.CampaignId + "/story/" + newTown._id);
			})
		}
	})
})
router.get("/:TownId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.findById(req.params.TownId).populate("NPCs").populate("Locations").exec(function(err, town){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					res.render("story/town/show", {campaign:campaign, town:town});
				}
			});
		}
	});
});
router.get("/:TownId/location/new", middleware.checkCampaignOwnership, function(req, res){
	Campaign.findById(req.params.CampaignId).populate("weapons").populate("items").populate("armour").exec(function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.findById(req.params.TownId).populate("NPCs").populate("Locations").exec(function(err, town){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					res.render("story/location/new", {campaign:campaign, town:town});
				}
			});
		}
	});
});

// Create Location Link
router.post("/:TownId/location", middleware.checkCampaignOwnership, function(req, res){
	console.log(req.body)
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.findById(req.params.TownId, function(err, town){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					var allweapons = [];
					var allitems = [];
					var allarmour = [];
					req.body.weapons.forEach(function(weapon){
						Weapon.findById(weapon, function (err, foundWeapon){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								foundWeapon._id = mongoose.Types.ObjectId();
								foundWeapon.isNew = true;
								foundWeapon.Inventory = 1;
								foundWeapon.save();
								allweapons.push(foundWeapon)
						}})});
					req.body.items.forEach(function(item){
						Item.findById(item, function (err, foundItem){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								foundItem._id = mongoose.Types.ObjectId();
								foundItem.isNew = true;
								foundItem.Inventory = 1;
								foundItem.save();
								allitems.push(foundItem)
						}})});
					req.body.armour.forEach(function(armour){
						Armour.findById(armour, function (err, foundarmour){
							if (err){
								console.log(err);
								res.redirect("back")
							}else{
								foundarmour._id = mongoose.Types.ObjectId();
								foundarmour.isNew = true;
								foundarmour.Inventory = 1;
								foundarmour.save();
								allarmour.push(foundarmour)
						}})});
					Location.create(req.body.location, function(err, newLocation){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							newLocation.Weapons = allweapons;
							newLocation.Items = allitems;
							newLocation.Armour = allarmour;
							newLocation.save();
							town.Locations.push(newLocation);
							town.save();
							res.redirect("/campaigns/"+req.params.CampaignId +"/story/" + req.params.TownId)
						}
					})
				}
			})
		}
	})
		})
// Location Show Page
router.get("/:TownId/:LocationId", middleware.checkCampaignUsers, function(req, res){
	Campaign.findById(req.params.CampaignId, function(err, campaign){
		if(err){
			console.log(err);
			res.redirect("back")
		}else{
			Town.findById(req.params.TownId).populate("NPCs").populate("Locations").exec(function(err, town){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					  Location.findById(req.params.LocationId).populate("NPCs").populate("Weapons").populate("Items").populate("Armour").exec(function(err, location){
						  if(err){
							  console.log(err);
							  res.redirect("back");
						  }else{
							  res.render("story/location/show", {campaign:campaign, town:town, location:location});
						  }
					  })
				}
			});
		}
	});
});

// Inventory Update Put Route
router.put("/:TownId/:LocationId/weapons/:WeaponId", function(req, res){
	if(req.body.Inventory){
				Location.findById(req.params.LocationId, function(err, location){
									if (err){
										console.log(err);
										res.redirect("back");
									}else{
										location.Weapons.forEach(function(weapon){
											if(weapon._id.equals(req.params.WeaponId)){
											Weapon.findById(req.params.WeaponId, function(err, foundWeapon){
												foundWeapon.Inventory = req.body.Inventory
												foundWeapon.markModified("weapon.Inventory")
												foundWeapon.save();
												location.save();
											})
											}
											})
										res.redirect("back");
									}
								})					
		}else{
			Weapon.findById(req.body.weaponsInput, function(err, weapon){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					Character.findById(req.session.playCharacter._id, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							if(character.Money > weapon.Cost){
							character.Weapons.push(weapon);
							console.log(weapon.Cost)
							
							var Money = character.Money - weapon.Cost;
							console.log(Money)
							character.Money = Money;
							character.markModified("character.Money");
							character.save();
							req.session.playCharacter = character;
							weapon.Inventory -= 1;
							weapon.save();
							if(weapon.Inventory === 0){
								Location.findById(req.params.LocationId, function (err, location){
									location.Weapons.pull(weapon._id);
									location.save();
								})
							}
							req.flash("success", "You have aquired a "+weapon.Name);
							res.redirect("back");
						}else{
							req.flash("error", "Come back when you have more money!")
							res.redirect("back")
						}}
					})
				}
			})
		}
	})
router.put("/:TownId/:LocationId/weapons/:WeaponId", function(req, res){
	if(req.body.Inventory){
				Location.findById(req.params.LocationId, function(err, location){
									if (err){
										console.log(err);
										res.redirect("back");
									}else{
										location.Weapons.forEach(function(weapon){
											if(weapon._id.equals(req.params.WeaponId)){
											Weapon.findById(req.params.WeaponId, function(err, foundWeapon){
												foundWeapon.Inventory = req.body.Inventory
												foundWeapon.markModified("foundWeapon.Inventory")
												foundWeapon.save();
												location.save();
											})
											}
											})
										res.redirect("back");
									}
								})					
		}else{
			Weapon.findById(req.body.weaponsInput, function(err, weapon){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					Character.findById(req.session.playCharacter._id, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							if(character.Money > weapon.Cost){
							character.Weapons.push(weapon);
							var Money = character.Money - weapon.Cost;
							character.Money = Money;
							character.markModified("character.Money");
							character.save();
							req.session.playCharacter = character;
							weapon.Inventory -= 1;
							weapon.save();
							if(weapon.Inventory === 0){
								Location.findById(req.params.LocationId, function (err, location){
									location.Weapons.pull(weapon._id);
									location.save();
								})
							}
							req.flash("success", "You have aquired a "+weapon.Name);
							res.redirect("back");
						}else{
							req.flash("error", "Come back when you have more money!")
							res.redirect("back")
						}}
					})
				}
			})
		}
	})
router.put("/:TownId/:LocationId/items/:ItemId", function(req, res){
	if(req.body.Inventory){
				Location.findById(req.params.LocationId, function(err, location){
									if (err){
										console.log(err);
										res.redirect("back");
									}else{
										location.Items.forEach(function(item){
											if(item._id.equals(req.params.ItemId)){
											Item.findById(req.params.ItemId, function(err, foundItem){
												foundItem.Inventory = req.body.Inventory
												foundItem.markModified("foundItem.Inventory")
												foundItem.save();
												location.save();
											})
											}
											})
										res.redirect("back");
									}
								})					
		}else{
			Item.findById(req.body.itemsInput, function(err, item){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					Character.findById(req.session.playCharacter._id, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							if(character.Money > item.Cost){
							character.Weapons.push(item);
							var Money = character.Money - item.Cost;
							character.Money = Money;
							character.markModified("character.Money");
							character.save();
							req.session.playCharacter = character;
							item.Inventory -= 1;
							item.save();
							if(item.Inventory === 0){
								Location.findById(req.params.LocationId, function (err, location){
									location.Items.pull(item._id);
									location.save();
								})
							}
							req.flash("success", "You have aquired a "+item.Name);
							res.redirect("back");
						}else{
							req.flash("error", "Come back when you have more money!")
							res.redirect("back")
						}}
					})
				}
			})
		}
	})
	router.put("/:TownId/:LocationId/armour/:ArmourId", function(req, res){
		if(req.body.Inventory){
					Location.findById(req.params.LocationId, function(err, location){
										if (err){
											console.log(err);
											res.redirect("back");
										}else{
											location.Armour.forEach(function(armour){
												if(armour._id.equals(req.params.ArmourId)){
												Armour.findById(req.params.ArmourId, function(err, foundArmour){
													foundArmour.Inventory = req.body.Inventory
													foundArmour.markModified("foundArmour.Inventory")
													foundArmour.save();
													location.save();
												})
												}
												})
											res.redirect("back");
										}
									})					
			}else{
				Armour.findById(req.body.armourInput, function(err, armour){
					if(err){
						console.log(err);
						res.redirect("back")
					}else{
						Character.findById(req.session.playCharacter._id, function(err, character){
							if(err){
								console.log(err)
								res.redirect("back")
							}else{
								if(character.Money > armour.Cost){
								character.Weapons.push(armour);
								var Money = character.Money - armour.Cost;
								console.log(Money)
								character.Money = Money;
								character.markModified("character.Money");
								character.save();
								req.session.playCharacter = character;
								armour.Inventory -= 1;
								armour.save();
								if(armour.Inventory === 0){
									Location.findById(req.params.LocationId, function (err, location){
										location.Armour.pull(armour._id);
										location.save();
									})
								}
								req.flash("success", "You have aquired a "+armour.Name);
								res.redirect("back");
							}else{
								req.flash("error", "Come back when you have more money!")
								res.redirect("back")
							}}
						})
					}
				})
			}
		})
// Campaign Weapon Index
router.get("/weapons", function(req, res){
	Campaign.findById(req.params.CampaignId).populate("weapons").exec(function(err, campaign){
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
router.get("/weapons/new")
router.put("/weapons", function(req, res){
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
					Character.findById(req.session.playCharacter._id, function(err, character){
						if(err){
							console.log(err)
							res.redirect("back")
						}else{
							if(character.Money > weapon.Cost){
							character.Weapons.push(weapon);
							console.log(weapon.Cost)
							
							var Money = character.Money - weapon.Cost;
							console.log(Money)
							character.Money = Money;
							character.markModified("character.Money");
							character.save();
							req.session.playCharacter = character;
							req.flash("success", "You have aquired a "+weapon.Name);
							res.redirect("back");
						}else{
							req.flash("error", "Come back when you have more money!")
							res.redirect("back")
						}}
					})
				}
			})
		}
	})

module.exports = router;