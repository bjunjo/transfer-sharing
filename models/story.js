var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
   created:  {type: Date, default: Date.now}
});

module.exports = mongoose.model("Story", storySchema);