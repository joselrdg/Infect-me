const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");


module.exports.showDashboard = ((req, res, next) => {

  Post.find({ user: req.currentUser._id })
    .then((posts) => {



      for (let i = 0; i <= (posts.length - 1); i++) {
        if (i > 2) {
          posts[i].collapse = true;

        }

      }
      let vermas = true;
      res.render('users/dashboard', { posts,vermas });

    })
    .catch((e => next(e)));


})

module.exports.findUser = ((req,res,next) => {
  console.log('Busca usuario',req.params.user)
  User.find({userName: req.params.user})
  .then((user) => {
     if (user){
       res.json(user)
     } else {
       console.log ('No encuentra el suario')
     }
  }) 

 // next()
})