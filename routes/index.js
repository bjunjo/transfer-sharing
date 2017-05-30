var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// landing page
router.get("/", function(req, res){
  res.render("landing");
});

// Show regsiter form
router.get("/register", function(req, res){
  res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Transfer Sharing " + user.username + "!");
      res.redirect("/stories");
    });
  });
});

// Show login form
router.get("/login", function(req, res){
  res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/stories",
    failureRoute: "/login"
  }), function(req, res){
});

// Logout logic; logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/stories");
});

module.exports = router;