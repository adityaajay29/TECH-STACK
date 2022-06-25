//jshint esversion:6
 
// get method : user trying to get the content
// post method : 

// adding all aur packages ----- 1

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// adding lodash package to make work easier ----- 18
const _ = require("lodash");
const { stubString } = require("lodash");

// requiring mongoose to add mongo -----20

const mongoose = require("mongoose");

// connecting mongoose to blogDB -----21

mongoose.connect("mongodb+srv://adityaajay29:Ganesha123@adityacluster.wlqt1.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser : true});

const homeStartingContent = "Hey! Welocome to my blog website - One place for all exciting technologies. Here, I post latest dope-techs happening around the world. Any suggestions and updates are most welcome :)";
const aboutPageContent = "I am Aditya Ajay. A final year B.Tech student of ECE at National Institue of Technology Agartala. I enjoy reading and watching videos about latest happenings in Tech-world. So, I thought of creating this website so that all tech enthusiast can get insight of these technologies at one place!";
const contactPageContent = "If you have any feedback or you want to contribute some content to this website, then you can contact me via any of these platforms : ";

// setting up server ----- 2
// creating new express application 

const app = express(); 

// setting server to enable ejs ----- 3
// use exactly "view engine"
// place all the ejs files in a folder named "views"

app.set("view engine", "ejs");

// setting server to use body parser ----- 4

app.use(bodyParser.urlencoded({extended : true}));

// setting server to use public folder to access all the static files ----- 5
// so no need to spacify pulic in the directory of css file

app.use(express.static("public"));

// creating new schema for our new collection -----22

const postSchema = (
  {
    title : String, 
    content : String
  }
);

// creating new collection ------23

const Post = mongoose.model("post", postSchema);


// get method to send contents to home page, i.e., root route ----- 7

app.get("/", function(req, res)
{
  // in EJS, we use render method to get whatever is on a ejs page
  // to pass aditioal info, we use js objets, which have key val pairs

  // also adding posts contents to the home page ----- 25

  Post.find({}, function(err, posts)
  {
    res.render("home", {
      homeContent : homeStartingContent,
      posts : posts
    });
  });
});

// about page ----- 8

app.get("/about", function(req, res)
{
  res.render("about", {aboutContent : aboutPageContent});
});

// contact page ----- 9

app.get("/contact", function(req, res)
{
  res.render("contact", {contactContent : contactPageContent});
});

// compose page ----- 10

app.get("/compose", function(req, res)
{
  res.render("compose");
});

// express routing : 1st step to create the dynamic app ----- 17
// parameters for routing
// req.params : {"post" : "postName", "details" : "postDetails"}
// to access whichever route of post, we write req.params.postName
// in url, we write : ex : localhost:3000/post/examplePost

app.get("/posts/:postid", function(req, res)
{
// using lodash to convert any type of string to lowerCase -----19
// then, using express routing to check if the postTitle 
// (lets say example title) exists
// if exists, then render it in post.ejs page
// the url will be like : localhost:3000/posts/example-title

  const requestedPostId = req.params.postid;

  Post.findOne({_id : requestedPostId}, function(err, post)
  {
    res.render("post", {
      post_title : post.title,
      post_content : post.content
    });
  });
});


// to get hold of whatever is written in the compose input ----- 11
// we use bodyParser, to request to get hold of the value

app.post("/compose", function(req, res) 
{
// creating an obejct named post to store the title and content from the compose page

// creating new document "post", to store the posts in databse ----- 24

  const post = new Post(
    {
      title : req.body.postTitle,
      content : req.body.postContent
    }
  );
  post.save(function(err)
  {
    if(!err)
    {
      // after every submissions, we will redirect to home page -----15
      res.redirect("/");
    }
  });
});




// chosing port process.env.PORT || 3000 to run on www ----- 6

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function()
{
  console.log("server started successfully");
});