var express = require("express");
var router = express.Router({mergeParams: true});
var Story = require("../models/story");
var Comment = require("../models/comment");
var middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  var title = req.body.story.title,
      image = req.body.story.image,
      body  = req.body.story.body,
      author = {
        id: req.user._id,
        username: req.user.username
      },
      newStory = {title: title, image: image, body: body, author: author}
  req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  Story.create(newStory, function(err, newStory){
    if(err){
      res.render("new");
    } else {
      res.redirect("/stories")
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

// Comment CREATE 
router.post("/:id", middleware.isLoggedIn, function(req, res){
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

// Comment Edit
router.get("/:id/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      console.log(err);
    } else {
      console.log(foundComment);
      res.render("comment_edit",{story_id: req.params.id, comment: foundComment});
    }
  });
});

// Comment UPDATE
router.put("/:id/:comment_id", middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back")
    } else {
      res.redirect("/stories/" + req.params.id)
    }
  });
});

// Comment Delete
router.delete("/:id/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/stories/" + req.params.id);
    }
  });
});

// Story Edit
router.get("/:id/edit", middleware.checkStoryOwnership, function(req, res){
  Story.findById(req.params.id, function(err, foundStory){
    if(err){
      res.redirect("/");
    } else {
      res.render("edit", {story: foundStory});
    }
  }); 
});

// Story UPDATE
router.put("/:id", middleware.checkStoryOwnership, function(req, res){
  // req.body.story.body = req.sanitize(req.body.story.body); // use a middleware later
  Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updatedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("" + req.params.id);
    }
  });
});

// Story DELETE
router.delete("/:id", middleware.checkStoryOwnership, function(req, res){
  Story.findByIdAndRemove(req.params.id, function(err, removedStory){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/stories");
    }
  });
});

module.exports = router;