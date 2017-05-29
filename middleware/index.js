var Story = require("../models/story");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkStoryOwnership = function(req, res, next){
  if(req.isAuthenticated()){
      Story.findById(req.params.id, function(err, foundStory){
      if(err){
        res.redirect("back");
      } else {
        if(foundStory.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back")
        }
      }
    });
  } else {
    res.redirect("/login")
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back")
        }
      }
    });
  } else {
    res.redirect("/login")
  }
}
// loggin
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}
module.exports = middlewareObj