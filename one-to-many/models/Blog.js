const mongoose = require("mongoose");

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    title: String,
    author: String,
    images: []
  })
);

module.exports = Blog;