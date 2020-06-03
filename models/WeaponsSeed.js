var mongoose = require("mongoose")
var Campaign = require("./campaign")
var Weapon = require("./weapon")

var data =
[
    {Name: "Club",
    Type:"Simple",
    Cost: 0.10,
    Damage: {Die:"D4", Type: "Bludgeoning"},
    Weight: 2,
    Properties: {Light:true}
    },   
    {Name: "Dagger",
    Type:"Simple",
    Cost: 2,
    Damage: {Die:"D4", Type: "Piercing"},
    Weight: 1,
    Properties: {Finess:true,Light:true, Range: "20/60",Thrown:true}
    },   
    {Name: "Great-Club",
    Type:"Simple",
    Cost: 0.2,
    Damage: {Die:"D8", Type: "Bludgeoning"},
    Weight: 10,
    Properties: {TwoHanded:true}
    },   
    {Name: "Hand-Axe",
    Type:"Simple",
    Cost: 5,
    Damage: {Die:"D6", Type: "Slashing"},
    Weight: 2,
    Properties: {Light:true, Range: "20/60", Thrown:true}
    },
    {Name: "Javelin",
    Type:"Simple",
    Cost: 0.5,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight: 2,
    Properties: {Thrown:true, Range:"30/120"},
    },
    {Name: "Light Hammer",
    Type:"Simple",
    Cost: 2,
    Damage: {Die:"D4", Type: "Bludgeoning"},
    Weight: 2,
    Properties: {Light:true, Range: "20/60", Thrown:true}
    },   
    {Name: "Mace",
    Type:"Simple",
    Cost: 5,
    Damage: {Die:"D6", Type: "Bludgeoning"},
    Weight: 4,
    Properties: {}
    },   
    {Name: "Quarterstaff",
    Type:"Simple",
    Cost: 0.2,
    Damage: {Die:"D6", Type: "Bludgeoning"},
    Weight: 4,
    Properties: {Versatile:"D8"}
    },
    {Name: "Sickle",
    Type:"Simple",
    Cost: 1,
    Damage: {Die:"D4", Type: "Slashing"},
    Weight: 2,
    Properties: {Light:true}
    },
    {Name: "Spear",
    Type:"Simple",
    Cost: 1,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight: 3,
    Properties: {Thrown:true, Range:"20/60", Versatile:"D8"}
    },   
    {Name: "Unarmed",
    Type:"Simple",
    Cost: 0,
    Damage: {Die:"D1", Type: "Bludgeoning"},
    Weight: 0,
    Properties: {}
    },
    {Name: "Crossbow-light",
    Type:"Simple-Ranged",
    Cost: 25,
    Damage: {Die:"D8", Type: "Piercing"},
    Weight: 5,
    Properties: {Ammunition:true, Range:"80/320", Loading:true, TwoHanded:true}
    },   
    {Name: "Dart",
    Type:"Simple-Ranged",
    Cost: 0.05,
    Damage: {Die:"D4", Type: "Piercing"},
    Weight: 0.25,
    Properties: {Finesse:true, Range:"20/60", Thrown:true}
    },   
    {Name: "Shortbow",
    Type:"Simple-Ranged",
    Cost: 25,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight: 2,
    Properties: {Ammunition:true, Range:"80/320", TwoHanded:true}
    },   
    {Name: "Sling",
    Type:"Simple-Ranged",
    Cost: 0.1,
    Damage: {Die:"D4", Type: "Piercing"},
    Weight: 0,
    Properties: {Ammunition:true, Range:"30/120"}
    },   
    {Name: "Battleaxe",
    Type:"Martial",
    Cost: 10,
    Damage: {Die:"D8", Type: "Slashing"},
    Weight: 4,
    Properties: {Versatile:"D10"}
    },   
    {Name: "Flail",
    Type:"Martial",
    Cost: 10,
    Damage: {Die:"D8", Type: "Bludgeoning"},
    Weight: 2,
    Properties: {}
    },   
    {Name: "Glaive",
    Type:"Martial",
    Cost: 20,
    Damage: {Die:"D10", Type: "Slashing"},
    Weight:6,
    Properties: {Heavy:true, Reach:true, TwoHanded:true}
    },   
    {Name: "Greataxe",
    Type:"Martial",
    Cost: 30,
    Damage: {Die:"D12", Type: "Slashing"},
    Weight:7,
    Properties: {Heavy:true, TwoHanded:true}
    },   
    {Name: "Great-sword",
    Type:"Martial",
    Cost: 50,
    Damage: {Die:"2D6", Type: "Slashing"},
    Weight:6,
    Properties: {Heavy:true, TwoHanded:true}
    },    
    {Name: "Halberd",
    Type:"Martial",
    Cost: 20,
    Damage: {Die:"D10", Type: "Slashing"},
    Weight:6,
    Properties: {Heavy:true, Reach:true, TwoHanded:true}
    },    
    {Name: "Lance",
    Type:"Martial",
    Cost: 10,
    Damage: {Die:"D12", Type: "Piercing"},
    Weight:6,
    Properties: {Special:true, Reach:true}
    },   
    {Name: "Long-sword",
    Type:"Martial",
    Cost: 15,
    Damage: {Die:"D8", Type: "Slashing"},
    Weight:3,
    Properties: {Versatile:"D10"}
    },   
    {Name: "Maul",
    Type:"Martial",
    Cost: 10,
    Damage: {Die:"2D6", Type: "Bludgeoning"},
    Weight:10,
    Properties: {Heavy:true, TwoHanded:true}
    },   
    {Name: "Morning-star",
    Type:"Martial",
    Cost: 15,
    Damage: {Die:"D8", Type: "Piercing"},
    Weight:4,
    Properties: {}
    },   
    {Name: "Pike",
    Type:"Martial",
    Cost: 5,
    Damage: {Die:"D10", Type: "Piercing"},
    Weight:18,
    Properties: {Heavy:true, Reach:true, TwoHanded:true}
    },   
    {Name: "Rapier",
    Type:"Martial",
    Cost: 25,
    Damage: {Die:"D8", Type: "Piercing"},
    Weight:2,
    Properties: {Finess:true}
    },   
    {Name: "Scimitar",
    Type:"Martial",
    Cost: 25,
    Damage: {Die:"D6", Type: "Slashing"},
    Weight:3,
    Properties: {Finesse:true, Light:true}
    },   
    {Name: "Short-sword",
    Type:"Martial",
    Cost: 10,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight:2,
    Properties: {Finesse:true, Light:true}
    },   
    {Name: "Trident",
    Type:"Martial",
    Cost: 5,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight:4,
    Properties: {Range: "20/60", Thrown:true, Versatile:"D8"}
    },   
    {Name: "War Pick",
    Type:"Martial",
    Cost: 5,
    Damage: {Die:"D8", Type: "Piercing"},
    Weight:2,
    Properties: {}
    },   
    {Name: "War-hammer",
    Type:"Martial",
    Cost: 15,
    Damage: {Die:"D8", Type: "Bludgeoning"},
    Weight:2,
    Properties: {Versatile: "D10"}
    },   
    {Name: "Whip",
    Type:"Martial",
    Cost: 2,
    Damage: {Die:"D4", Type: "Slashing"},
    Weight:3,
    Properties: {Finesse:true, Reach:true}
    },   
    {Name: "Blowgun",
    Type:"Martial-Ranged",
    Cost: 10,
    Damage: {Die:"D1", Type: "Piercing"},
    Weight:1,
    Properties: {Ammunition:true, Range: "25/100", Loading:true}
    },   
    {Name: "Crossbow-hand",
    Type:"Martial-Ranged",
    Cost: 75,
    Damage: {Die:"D6", Type: "Piercing"},
    Weight:3,
    Properties: {Ammunition:true, Range: "30/120", Light:true, Loading:true}
    },   
    {Name: "Crossbow-Heavy",
    Type:"Martial-Ranged",
    Cost: 50,
    Damage: {Die:"D10", Type: "Piercing"},
    Weight:18,
    Properties: {Ammunition:true, Range: "100/400", Heavy:true, TwoHanded:true, Loading:true}
    },   
    {Name: "Longbow",
    Type:"Martial-Ranged",
    Cost: 50,
    Damage: {Die:"D8", Type: "Piercing"},
    Weight:2,
    Properties: {Ammunition:true, Range: "150/600", Heavy:true, TwoHanded:true}
    },   
    {Name: "Net",
    Type:"Martial-Ranged",
    Cost: 1,
    Damage: {Die:"", Type: ""},
    Weight:3,
    Properties: {Special:true, Range: "5/15"}
    }           
]
function seedWeapons(){
data.forEach(function(seed){
    Weapon.create(seed, function(err, weapon){
        if(err){
            console.log(err)
        }else{
            Campaign.findOne({title:"Never Say Die"}, function(err, campaign){
                if (err){
                    console.log(err)
                }else{
                campaign.weapons.push(weapon);
                campaign.save();
                console.log(campaign);
                }
            })
        }
    });
});
}



module.exports = seedWeapons;
