var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title:{
        type : String,
        required: true
    },

    link:{
        type: STring,
        required: true
    },
    // This 'note' object is a means of storing a refernece to a note
    // this will not store the actual note but simply reference another doc
    // I will later be able to take the note id and populate the window with the corresponding note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});


// this is what will create the model from the schema listed above

var Article = mongoose.model("Article", ArticleSchema);

// export the Article model 
module.exports = Article;