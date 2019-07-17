var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
 var path = require("path");
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsAndCommentsdb",{ useNewUrlParser: true});


app.get("/scrape", function(req, res){
    axios.get("https://www.propublica.org/").then(function(response){
        var $ = cheerio.load(response.data);

        $("h1.hed").each(function(i, element){

            var results = {};

            results.title = $(this)
            .children("a")
            .text();
            results.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
                .them(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("Scrape Complete")
    });
});

app.get("/articles", function(req, res){

    db.Article.find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});


// this route will search the database for an article that matches a notes id that has been entered
app.get("/articles/:id", function(req, res){

    // using the id that is passed into the url return the correct Article
    db.Article.findone({_id: req.params.id})

    // then right here it will populate the note database here
    // does this populate the db document or the note setion on the article document
    .populate("note")
    .then(function(dbArticle){
        // if we are able to succesfully find an article with the given id, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err){
        // If an error occured, send it to the client
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){

    db.Note.create(req.body)
        .then(function(dbNote){
            // This will hit once a note was successfully written to the db 
            // it will then search for a an article with an id that is in the params it will then assosciate it with the new note
            // Since our mongoose query returns a promise we can chain a bunch of .then functions
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
        })
        .then(function(dbArticle){
            // if we are able to update an article send it back to the client
            res.json(dbArticle);
        })
        // if an error occured send it out to the client
        .catch(function(err){
            res.json(err);
        });      
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!")
})