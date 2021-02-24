
const Post = require("../models/Post.model");
const mongoose = require("mongoose");

// const path = require('path');

module.exports.list = (req, res, next) => {
  Post.find(
    req.query.title
      ? {
        title: { $regex: req.query.title, $options: "i" },
      }
      : {}
  )
    .then((posts) => {
      res.render("posts/posts", { posts: posts, title: req.query.title });
    })
    .catch((e) => next(e));
};

module.exports.detail = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      res.render("posts/post", { ...post.toJSON(), delete: false });
    })
    .catch((e) => next(e));
};

module.exports.create = (req, res, next) => {
  res.render("posts/postForm");
};

module.exports.doCreate = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("posts/postForm", {
      errors: errors,
      post: req.body,
    });
  }
  const post = req.body;
  if (post.tags) {
    post.tags = post.tags.split(",");
  }
  console.log(post)

  Post.create(post)
    .then((p) => {
      console.log(`post creado`)
      res.render("posts/post", p)
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {     
        renderWithErrors(e.errors);
      } else {
        next(e);
      }
    });
};

module.exports.edit = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      res.render("posts/postForm", post);
    })
    .catch((e) => next(e));
};

module.exports.doEdit = (req, res, next) => {
  const post = req.body;
  if (post.tags) {
    post.tags = post.tags.split(",");
  }
  Post.findByIdAndUpdate(req.params.id, post, { new: true })
    .then((p) => res.render("posts/post", p))
    .catch((e) => next(e));
};

module.exports.delete = (req, res, next) => {
  Post.findById(req.params.id)
    .then((p) => res.render("/posts/post", { ...p.toJSON(), delete: true }))
    .catch((e) => next(e));
};

module.exports.doDelete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("posts/posts"))
    .catch((e) => next(e));
};