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

mongoose.connect("mongodb+srv://adityaajay29:Ganesha123@adityacluster.wlqt1.mongodb.net/blogDB", {useNewUrlParser : true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutPageContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactPageContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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

app.listen(3000, function () {
  console.log("server started successfully");
});