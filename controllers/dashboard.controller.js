const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");
const Friend = require("../models/friend.model");
const mailer= require("../config/nodemailer.config");


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
  // validar si ya son amigos
  Promise.all([
    Friend.find({user: req.currentUser._id,friend : req.body.frienduserid}),
    Friend.find({user: req.body.frienduserid,friend : req.currentUser._id})

  ])
  .then ((friends) =>{
   if (friends[0].length === 0 && friends[1].length === 0) {
    console.log('Friends: ',friends,friends[0].length)
    const friendship ={user: req.currentUser._id,friend : req.body.frienduserid}
 // crear relacion de amistad
    Friend.create(friendship)
    .then((friendship) =>{
      // enviar email de amistad
      console.log('FRIENDSHIP : ', friendship)
       mailer.sendMailFriend(req.currentUser._id,req.body.friendemail,friendship.activationToken);
       res.redirect('/dashboard');

       })
       
   }
  // res.redirect('/dashboard');
   
  })
 
  .catch((e) => next(e))

  
  next()
})