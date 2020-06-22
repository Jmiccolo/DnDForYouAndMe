var mongoose = require("mongoose")

var ClassSchema = new mongoose.Schema({
    Name: String,
    HitDice: {Number:Number, Die:Number},
    HitPoints: Number,
    Proficiences: {
        Weapons:{Type:String, Individual:[{type:mongoose.Schema.Types.ObjectId, ref:"Weapon"}]},
        Tools:[],
        Armour:[],
        SavingThrow:[],
        Skills:[],
    },
    SpellMod:String,
    SpellsKnown:Number,
    SpellSlots:Number,
    Features:[{type:mongoose.Schema.Types.ObjectId, ref:"Feature"}]
})