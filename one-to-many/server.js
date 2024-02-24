const mongoose = require("mongoose");


const db = require("./models");

const createBlog = function(blog) {
  return db.Blog.create(blog).then(docBlog => {
    console.log("\n>> Created Blog:\n", docBlog);
    return docBlog;
  });
};

const createImage = function(blogId, image) {
  console.log("\n>> Add Image:\n", image);
  return db.Blog.findByIdAndUpdate(
    blogId,
    {
      $push: {
        images: {
          url: image.url,
          caption: image.caption
        }
      }
    },
    { new: true, useFindAndModify: false }
  );
};

const run = async function() {
  var blog = await createBlog({
    title: "Blog #1",
    author: "Frank-Norris El Farsi"
  });

  blog = await createImage(blog._id, {
    path: "sites/uploads/images/mongodb.png",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png",
    caption: "MongoDB Database",
    createdAt: Date.now()
  });
  console.log("\n>> Blog:\n", blog);

  blog = await createImage(blog._id, {
    path: "sites/uploads/images/one-to-many.png",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/CPT-Databases-OnetoOne.svg/250px-CPT-Databases-OnetoOne.svg.png",
    caption: "One to Many Relationship",
    createdAt: Date.now()
  });
  console.log("\n>> Blog:\n", blog);
};

mongoose
  .connect("mongodb://localhost:27017/mongoose_relationship_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));


run();