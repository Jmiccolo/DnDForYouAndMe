var mongoose = require("mongoose")

var ClassSchema = new mongoose.Schema({
    Name: String,
    HitDice: Number,
    HitPoints: Number,
    Proficiences: {
        Weapons:[],
        Items:[],
        Tools:[],
        Armour:[],
        SavingThrow:[],
        Skills:[],
    },
})