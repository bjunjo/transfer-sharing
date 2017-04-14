var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    Comment          = require("./models/comment");
    Story            = require("./models/story");

app = express();

// App Configuration
mongoose.connect("mongodb://localhost/ts_0");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// RESTFUL routes
// landing page
app.get("/", function(req, res){
  res.render("landing");
});

// Index
app.get("/stories", function(req, res){
  Story.find({}, function(err, stories){
    if(err){
      console.log(err);
    } else {
      res.render("index", {stories: stories});
    }
  });
});

// NEW
app.get("/stories/new", function(req, res){
  res.render("new");
});

// CREATE
app.post("/stories", function(req, res){
  req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  console.log(req.body.story.body);
  Story.create(req.body.story, function(err, newStory){
    if(err){
      res.render("new");
    } else {
      res.redirect("/stories")
    }
  });
});

// SHOW
app.get("/stories/:id", function(req,res){
  Story.findById(req.params.id).populate("comments").exec(function(err, foundStory){
    if(err){
      res.redirect("/stories");
    } else {
      res.render("show", {story: foundStory});
    }
  });
});

// EDIT
app.get("/stories/:id/edit", function(req, res){
  Story.findById(req.params.id, function(err, foundStory){
    if(err){
      res.redirect("/stories");
    } else {
      res.render("edit", {story: foundStory});
    }
  });
});

// UPDATE
app.put("/stories/:id", function(req, res){
  req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updatedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/stories/" + req.params.id);
    }
  });
});

// DELETE
app.delete("/stories/:id", function(req, res){
  Story.findByIdAndRemove(req.params.id, function(err, removedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/stories");
    }
  });
});

// server listening
app.listen(1234, process.env.IP, function(){
  console.log("Server started...");
});

