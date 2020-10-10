var mongoose = require("mongoose");

var NoteSchema = new mongoose.Schema({
	Title:String,
    Paragraph:String,
    User:String,
});

module.exports = mongoose.model("Note", NoteSchema);