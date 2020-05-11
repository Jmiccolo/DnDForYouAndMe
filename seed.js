var mongoose = require("mongoose")
var User = require("./models/user")
var Character = require("./models/character")
var helper = require("./public/helper")

users = [
	{username:"Donald",
	 password:"password",
	},
	{username:"Matt",
	 password:"password",
	},{username:"Brian",
	 password:"password",
	},{username:"Sissy",
	 password:"password",
	},{username:"Jessica",
	 password:"password",
	},{username:"Donna",
	 password:"password",
	},{username:"Josh",
	 password:"password",
	},
]


characters = [	
	{creator:"Donald",
	name:"Harik",
    race:"Dwarf",
	class:"Paladin",
	image:"https://i.pinimg.com/736x/4a/b2/cb/4ab2cb994720a59b310737b1f81e6b70.jpg"
	},
	{creator:"Matt",
	name:"Harlov",
    race:"Dwarf",
	class:"Cleric",
	image:"https://i.pinimg.com/236x/0a/e8/c9/0ae8c966e82968a9b5eeca1b33c60c80--dwarf-paladin-rpg-cleric.jpg"
	},
	{creator:"Brian",
	name:"Ilin",
    race:"Aasimar",
	class:"Druid",
	image:"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1bebd154-3cec-433f-96a7-8442069ab770/dd7ipe4-d4058e14-1386-40be-a7d8-2788fda12816.jpg/v1/fill/w_1280,h_1657,q_75,strp/lamia__blue_tiefling_moon_druid_by_olieart_dd7ipe4-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xNjU3IiwicGF0aCI6IlwvZlwvMWJlYmQxNTQtM2NlYy00MzNmLTk2YTctODQ0MjA2OWFiNzcwXC9kZDdpcGU0LWQ0MDU4ZTE0LTEzODYtNDBiZS1hN2Q4LTI3ODhmZGExMjgxNi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.H-vHnOO9aip06EJYeCB9JBct71CbEB4iwy5lZ4PIGO0"
	},
	{creator:"Sissy",
	name:"Jest",
    race:"Half-elf",
	class:"Bard",
	image:"https://vignette.wikia.nocookie.net/dnd4/images/e/ee/Bard.jpg/revision/latest/scale-to-width-down/340?cb=20130418200514"
	},
	{creator:"Jessica",
	name:"Lia",
    race:"Aasimar",
	class:"Rogue",
	image:"https://i.pinimg.com/originals/de/8f/25/de8f25f927bf76bf8954fc31677268f9.png"
	},
	{creator:"Donna",
	name:"Valvori",
    race:"Tiefling",
	class:"Warlock",
	image:"https://external-preview.redd.it/JlJC16Ggqu2-eu2NyVqpWoFO-XHKku5XxFrn0Vfy2o8.jpg?auto=webp&s=bf7c319a3b7ce3dee3268e4207923aa8e351ba33"
	},
	{creator:"Josh",
	name:"Zander",
    race:"Firbolg",
	class:"Ranger",
	image:"https://i.ibb.co/yq7fmjC/zander-update.jpg"
	}
];
function SeedDB(){
// create usernames; 
	users.forEach(function(seed){
		User.create(seed, function(err, user){
			if(err){
				console.log(err);
			} else{
				console.log("user created");
				user.save();
			}
		})
	})
// create all characters
	characters.forEach(function(seed) {
		Character.create(seed, function(err, character){
			if(err){
				console.log(err);
			}else{
				console.log("character created");
				character.save();
			}
		});
	});
};

// create dice roll values
					   
 module.exports = SeedDB;