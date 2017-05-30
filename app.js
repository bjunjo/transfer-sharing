var express          = require("express"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    Comment          = require("./models/comment"),
    Story            = require("./models/story"),
    User             = require("./models/user"),
    storyRoutes      = require("./routes/stories"),
    indexRoutes      = require("./routes/index");
var app              = express();

mongoose.connect("mongodb://localhost/ts_0");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
  secret: "Secret cat",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/stories", storyRoutes);

// server listening
app.listen(3000, process.env.IP, function(){
  console.log("Server started...");
});

