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

const createComment = function(blogId, comment) {
  return db.Comment.create(comment).then(docComment => {
    console.log("\n>> Created Comment:\n", docComment);

    return db.Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: docComment._id } },
      { new: true, useFindAndModify: false }
    );
  });
};

const createCategory = function(category) {
  return db.Category.create(category).then(docCategory => {
    console.log("\n>> Created Category:\n", docCategory);
    return docCategory;
  });
};

const addBlogToCategory = function(blogId, categoryId) {
  return db.Blog.findByIdAndUpdate(
    blogId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

const getBlogWithPopulate = function(id) {
  return db.Blog.findById(id).populate("comments","-_id -__v");
};

const getBlogsInCategory = function(categoryId) {
  return db.Blog.find({ category: categoryId })
    .populate("category", "name -_id")
    .select("-comments -images -__v");
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

  blog = await createComment(blog._id, {
    username: "jack",
    text: "This is a great blog.",
    createdAt: Date.now()
  });
  console.log("\n>> Blog:\n", blog);

  blog = await createComment(blog._id, {
    username: "mary",
    text: "Thank you, it helps me alot.",
    createdAt: Date.now()
  });
  console.log("\n>> Blog:\n", blog);
  blog = await getBlogWithPopulate(blog._id);
  console.log("\n>> populated Blog:\n", blog);
  
  var category = await createCategory({
    name: "Node.js",
    description: "Node.js blog"
  });

  await addBlogToCategory(blog._id, category._id);

  var newBlog = await createBlog({
    title: "blog #2",
    author: "Frank Norris El Farsi"
  });

  await addBlogToCategory(newBlog._id, category._id);

  var blogs = await getBlogsInCategory(category._id);
  console.log("\n>> all Blog in Cagetory:\n", blogs);

};

mongoose
  .connect("mongodb://localhost:27017/mongoose_relationship_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));


run();