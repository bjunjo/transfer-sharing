var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    Story            = require("./models/story");
app = express();

// App Configuration
mongoose.connect("mongodb://localhost/ts_0");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// DB Testing
// Story.create(
//   {
//     title: "Post one",
//     image: "https://farm4.staticflickr.com/3373/3600836516_ab924c6729.jpg",
//     description: "Lorem impsum memento mori una ragazza mio roemo mi casa su casa."
//   }, function(err, newlyCreatedStory){
//      if(err){
//       console.log(err);
//      } else {
//        console.log("Newly Created Story: \t" + newlyCreatedStory);
//      }
//   });

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
// server listening
app.listen(1234, process.env.IP, function(){
  console.log("Server started...");
});

