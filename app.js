const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//==============MongoDB=================
const dbUrl = "mongodb://localhost:27017/wikiDB";
mongoose.connect(dbUrl, {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);


//===============REQ & RES ALL ARTICLES===================
app.get("/", function(req, res) {
  res.send("hello");
});

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundList) {
      if (!err) {
        console.log(foundList);
      } else {
        console.log(err);
      }
    });
  })
  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully saved document");
      }
    });

    res.send("got ya!");
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("successfully deleted all articles.");
        console.log("successfully deleted all articles.");
      } else {
        console.log(err);
      }
    });
  })

//===============REQ & RES A SPECIFIC ARTICLES===================
app.route("/articles/:articleTitle")

  .get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
      if(!err){
        console.log(req.params.articleTitle);
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No article matching!");
        }
      }else{
        console.log(err);
      }
    });
  })

  .put(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      function(err){
        if(!err){
          res.send("successfully updated!");
        }else{
          console.log(err);
        }
    });
  })

  .patch(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {$set:req.body},
      function(err){
        if(!err){
          res.send("successfully updated article!");
        }else{
          res.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title:req.params.articleTitle},
      function(err){
        if(!err){
          res.send("successfully deleted all about "+req.params.articleTitle);
        }else{
          console.log(err);
        }
    });
  });

//===============LISTENING PORT===================

app.listen(3000, function(err) {
  if (!err) {
    console.log("Server started on port 3000.");
  } else {
    console.log(err);
  }
});
