var mongoose = require("mongoose");

var AttributeSchema = new mongoose.Schema ({
    Strength: [{Value:Number}, {Save:Boolean}, {Athletics:Boolean}],
    Dexterity: [{Value:Number}, {Save:Boolean}, {Acrobatics:Boolean}, {Sleight:Boolean}, {Stealth:Boolean}],
    Constitution: [{Value:Number}, {Save:Boolean}],
    Intelligence: [{Value:Number}, {Save:Boolean}, {Arcana:Boolean}, {History:Boolean}, {Investigation:Boolean}, {Nature: Boolean}, {Religion:Boolean}],
    Wisdom: [{Value:Number}, {Save:Boolean}, {AnimalHandling:Boolean}, {Insight:Boolean}, {Medicine:Boolean}, {Perception:Boolean}, {Survival:Boolean}],
    Charisma: [{Value:Number}, {Save:Boolean}, {Deception:Boolean}, {Intimidation:Boolean}, {Performance:Boolean}, {Persuasion:Boolean}]
}, {_id:false});

module.exports = mongoose.model("Attribute", AttributeSchema);