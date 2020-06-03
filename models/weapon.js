var mongoose = require("mongoose");

var WeaponSchema = new mongoose.Schema ({
    Name:String,
    Type:String,
    Cost:Number,
    Damage:{Die:String, Type:String},
    Weight: Number,
    Properties: {
        Ammunition:Boolean,
        Finesse:Boolean,
        Heavy:Boolean,
        Light:Boolean,
        Loading:Boolean, 
        Range: String,
        Reach:Boolean,
        Special:Boolean,
        Thrown: Boolean,
        TwoHanded: Boolean,
        Versatile: String,
        Silvered: Boolean,
        Lance: Boolean
    },
})

module.exports = mongoose.model("Weapon", WeaponSchema);