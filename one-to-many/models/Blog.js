const mongoose = require("mongoose");

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    title: String,
    author: String,
    images: [],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
     category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }
  })
);

module.exports = Blog;