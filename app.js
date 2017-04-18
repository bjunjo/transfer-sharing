var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    express          = require("express"),
    app              = express(),
    Comment          = require("./models/comment"),
    Story            = require("./models/story"),
    User             = require("./models/user");

mongoose.connect("mongodb://localhost/ts_0");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Passport Configuration
app.use(require("express-session")({
  secret: "Secret cat",
  resave: false,
  saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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

// Make Comments on a show page
app.post("/stories/:id", function(req, res){
  // find story id
  Story.findById(req.params.id, function(err, story){
    if(err){
      console.log(err);
      res.redirect("/stories/" + req.params.id);
    } else {
      // add comment
    Comment.create(req.body.comment, function(err, comment){
      if(err){
        console.log(err);
      } else {
        story.comments.push(comment);
        story.save();
        res.redirect("/stories/" + story._id);
      }
    });
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

// =======
// Auth
// =======
// Show regsiter form
app.get("/regsiter", function(req, res){
  res.render("register");
});
// Handle sign up logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/stories");
    });
  });
});
// Logic Route

// server listening
app.listen(3000, process.env.IP, function(){
  console.log("Server started...");
});

