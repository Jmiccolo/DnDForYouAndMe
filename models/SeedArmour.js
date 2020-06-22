var mongoose = require("mongoose");

var standardArmour = [{
    Name: "Padded",
    Type: "Light",
    Weight: 800,
    Cost: 500,
    Class: 11,
    StealthDis: true,
    DexMod:true,
    ifStrength: false,
    Strength:null
},
{
    Name: "Leather",
    Type: "Light",
    Weight: 1000,
    Cost: 1000,
    Class: 11,
    StealthDis: false,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Studded Leather",
    Type: "Light",
    Weight: 1300,
    Cost: 4500,
    Class: 12,
    StealthDis: false,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Hide",
    Type: "Medium",
    Weight: 1200,
    Cost: 1000,
    Class: 12,
    StealthDis: false,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Chain Shirt",
    Type: "Medium",
    Weight: 2000,
    Cost: 5000,
    Class: 13,
    StealthDis: false,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Scale Mail",
    Type: "Medium",
    Weight: 4500,
    Cost: 5000,
    Class: 14,
    StealthDis: true,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Breastplate",
    Type: "Medium",
    Weight: 2000,
    Cost: 40000,
    Class: 14,
    StealthDis: false,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Halfplate",
    Type: "Medium",
    Weight: 4000,
    Cost: 75000,
    Class: 15,
    StealthDis:true,
    DexMod: true,
    ifStrength:false,
    Strength:null
},
{
    Name: "Ring Mail",
    Type: "Heavy",
    Weight: 4000,
    Cost: 3000,
    Class: 14,
    StealthDis:true,
    DexMod: false,
    ifStrength:false,
    Strength:null
},
{
    Name: "Chain Mail",
    Type: "Heavy",
    Weight: 5500,
    Cost: 7500,
    Class: 16,
    StealthDis:true,
    DexMod: false,
    ifStrength: true,
    Strength:13
},
{
    Name: "Splint",
    Type: "Heavy",
    Weight: 6000,
    Cost: 20000,
    Class: 17,
    StealthDis:true,
    DexMod: false,
    ifStrength:true,
    Strength: 15
},
{
    Name: "Plate",
    Type: "Heavy",
    Weight: 6500,
    Cost: 150000,
    Class: 18,
    StealthDis:true,
    DexMod: false,
    ifStrength:true,
    Strength:18
},
{
    Name: "Shield",
    Type: "Shield",
    Weight: 600,
    Cost: 1000,
    Class: 2,
    StealthDis:false,
    DexMod: false,
    ifStrength:false,
    Strength:null
}]

module.exports = standardArmour

