
const Post = require("../models/Post.model");
const mongoose = require("mongoose");


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

module.exports.listUser = (req, res, next) => {
  console.log(req.currentUser)
  Post.find({ user: req.user._id })
  .then((posts) => {
      console.log(posts[0])
      res.render("posts/posts", { posts: posts, title: req.query.title });
    })
    .catch((e) => next(e));
};

module.exports.detail = (req, res, next) => {
  Post.findById(req.params.id)
  .then((post) => {
      const currUserId = req.currentUser._id
      const {user} = post;
      if(currUserId.equals(user)){
        console.log('son iguales')        
        res.render("posts/post", { ...post.toJSON(), delete: false, userEdit: true });
      } else {
        console.log('NO son iguales')
        res.render("posts/post", { ...post.toJSON(), delete: false, userEdit: false });      
      }
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
  post.user = req.currentUser._id;

  Post.create(post)
    .then((p) => {
      if (p.user == req.user._id) {
        p.userEdit = true;
        res.render("posts/post", p)
      }
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
  console.log(req.params)
  Post.findById(req.params.id)
    .then((p) => res.render("posts/post", { ...p.toJSON(), deleteModal: true }))
    .catch((e) => next(e));
};

module.exports.doDelete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/posts/list"))
    .catch((e) => next(e));
};