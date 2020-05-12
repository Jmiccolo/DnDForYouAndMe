
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
	campaigns:[{type: mongoose.Schema.Types.ObjectId, ref:"Campaign"}],
	characters:[{type: mongoose.Schema.Types.ObjectId, ref:"Character"}],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);




