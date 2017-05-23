var express = require("express");
var router = express.Router({mergeParams: true});
var Story = require("../models/story");
var Comment = require("../models/comment");

// Index
router.get("/", function(req, res){
  Story.find({}, function(err, stories){
    if(err){
      console.log(err);
    } else {
      res.render("index", {stories: stories});
    }
  });
});

// NEW
router.get("/new", isLoggedIn, function(req, res){
  res.render("new");
});

// CREATE
router.post("/", isLoggedIn, function(req, res){
  req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  Story.create(req.body.story, function(err, newStory){
    if(err){
      res.render("new");
    } else {
      res.redirect("/")
    }
  });
});

// SHOW
router.get("/:id", function(req,res){
  Story.findById(req.params.id).populate("comments").exec(function(err, foundStory){
    if(err){
      res.redirect("/");
    } else {
      res.render("show", {story: foundStory});
    }
  });
});

// Make comments on a show page
router.post("/:id", isLoggedIn, function(req, res){
  // find story id
  Story.findById(req.params.id, function(err, story){
    if(err){
      console.log(err);
      res.redirect("/" + req.params.id);
    } else {
      // add comment
    Comment.create(req.body.comment, function(err, comment){
      if(err){
        console.log(err);
      } else {
        // add username and id to comment
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        // save comment
        comment.save();
        story.comments.push(comment);
        story.save();
        res.redirect("" + story._id);
      }
    });
    }
  });
});

// EDIT
router.get("/:id/edit", function(req, res){
  Story.findById(req.params.id, function(err, foundStory){
    if(err){
      res.redirect("/");
    } else {
      res.render("edit", {story: foundStory});
    }
  });
});

// UPDATE
router.put("/:id", function(req, res){
  req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updatedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/" + req.params.id);
    }
  });
});

// DELETE
router.delete("/:id", function(req, res){
  Story.findByIdAndRemove(req.params.id, function(err, removedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/");
    }
  });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;