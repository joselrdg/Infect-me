const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");
const Friend = require("../models/friend.model");
const mailer = require("../config/nodemailer.config");


module.exports.showDashboard = ((req, res, next) => {

  Post.find({ user: req.currentUser._id })
    .then((posts) => {



      for (let i = 0; i <= (posts.length - 1); i++) {
        if (i > 2) {
          posts[i].collapse = true;

        }

      }
      let vermas = true;
      res.render('users/dashboard', { posts, vermas });

    })
    .catch((e => next(e)));


})

module.exports.findUser = ((req, res, next) => {

  User.find({ userName: req.params.user })
    .then((user) => {
      if (user) {
        res.json(user)
      } else {
        console.log('No encuentra el usuario')
      }
    })

  // next()
})

module.exports.friendEmail = ((req, res, next) => {
  // validar si ya son amigos
  Promise.all([
    Friend.find({ user: req.currentUser._id, friend: req.body.frienduserid }),
    Friend.find({ user: req.body.frienduserid, friend: req.currentUser._id })

  ])
    .then((friends) => {
      let friendship;
      if (friends[0].length > 0) {
        friendship = friends[0][0]

      } else if (friends[1].length > 0) {
        friendship = friends[1][0]
      }
      if (friendship){
      if (friendship.status === 'Active' || friendship.status === 'Pending') {
  
        res.redirect('/dashboard');
      }
      } else {
        const friendshipData = { user: req.currentUser._id, friend: req.body.frienduserid }
        // crear relacion de amistad
        Friend.create(friendshipData)
          .then((friendshipData) => {
            // enviar email de amistad
            mailer.sendMailFriend(req.currentUser.userName, req.body.friendemail, friendshipData.activationToken);
            res.redirect('/dashboard');

          })
      }
    })
    .catch((e) => next(e))
})

module.exports.activateFriend = ((req,res,next) => {
  Friend.findOneAndUpdate(
    {
      activationToken: req.params.activationToken
    },
    {
      status: 'Active',
      activationToken: 'Active'
    }
  ).populate('user')
  .then((friend) => {
    console.log("Amigo ",friend.user)
  res.render('friendship',{friend : friend})
  })
  .catch((e) => next(e))

});
