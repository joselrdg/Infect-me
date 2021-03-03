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
 
  User.find({userName: req.params.user})
  .then((user) => {
     if (user){
       res.json(user)
     } else {
       console.log ('No encuentra el usuario')
     }
  }) 

 // next()
})

module.exports.friendEmail = ((req,res,next) => {

  console.log(`ENVIO DE EMAIL DE AMISTAD ${req.body.frienduserid} ${req.body.friendemail}`)
  
  // crear relacion de amistad
  // enviar email de amistad
  next();
})