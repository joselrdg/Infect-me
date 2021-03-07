const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");
const Friend = require("../models/friend.model");
const mailer = require("../config/nodemailer.config");
const flash = require("connect-flash");
const Profile = require("../models/Profile.model");

module.exports.showDashboard = ((req, res, next) => {
  Promise.all(
    [
      Post.find({ user: req.currentUser._id }),
      Friend.find({ user: req.currentUser._id })
      .populate('profile')
      .populate('friend'),
   
    ]
  )
    .then((containerDashboard) => {
      if (containerDashboard[0]) {
        let posts = containerDashboard[0]
        let friends = containerDashboard[1]
        let pages = containerDashboard[2]
      //POSTS
        let i=0;
        posts.forEach(post => {
          if (i > 2) {
            post.collapse = true;

          }
          i++
        });
        let vermas = true;
        // Friends
        const friendsSelected = friends.filter ( friend => {
         
  
          return ((friend.status === 'Active' ) && (friend.profile[0].profileUser)) 
        })
        //PAGES

   
     //   if (pages[0]) {
     //       console.log('hay paginaaaas', pages[0])
     //       
   //
     //   } else {
     //       console.log('no hay paginas')
   //
     //   }

        res.render('users/dashboard', { posts, vermas, friendsSelected });

      } else {
        res.render('users/dashboard');
      }
    })
    .catch((e) => next(e))


  

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
      if (friendship) {
        if (friendship.status === 'Active' || friendship.status === 'Pending') {
          if (friendship.status === 'Active') {
            req.flash('flashMessage', 'Ya sois amigos')
          }
          if (friendship.status === 'Pending') {
            req.flash('flashMessage', 'Hay una solicidud de amistad pendiente')
          }

          res.redirect('/dashboard');
        }
      } else {
        const friendshipData = { user: req.currentUser._id, friend: req.body.frienduserid }
        // crear relacion de amistad
        Friend.create(friendshipData)
          .then((friendshipData) => {
            // enviar email de amistad
            mailer.sendMailFriend(req.currentUser.userName, req.body.friendemail, friendshipData.activationToken);
            req.flash('flashMessage', 'Solicitud de amistad enviada')

            res.redirect('/dashboard');

          })
      }
    })
    .catch((e) => next(e))
})

module.exports.activateFriend = ((req, res, next) => {
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
      console.log("Amigo ", friend.user)
      res.render('friendship', { friend: friend })
    })
    .catch((e) => next(e))

});
module.exports.deleteFriend = ((req,res,next) => {
  Friend.deleteOne({_id: req.params.id})
  .populate('friend')
  .then((friendDeleted) => {
   
    req.flash('flashMessage', `Eliminada relación de amistad`)

    res.redirect('/dashboard');

  })
  .catch((e) => next(e))
})  
