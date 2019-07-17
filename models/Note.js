var mongoose = require("mongoose");


// this will save a reference to the shcema constructor
var Schema = mongoose.Schema; 


// using the Schema Constructor, create a new NoteSchema objet
// this is similar to the Sequelize model
var NoteSchema = new Schema({   
    title: String,
    body: String

});

// this creates our model from the above schema, using mongooses's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
