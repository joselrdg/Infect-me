const mongoose =require ("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");


module.exports.showDashboard = ( (req, res, next) => {
   console.log(`user: ${req.currentUser._id} user name: ${req.currentUser.userName}`)
    console.log(req.currentUser)  
  Post.findOne({user: req.currentUser._id})
    .then((posts) => {
        const postArray =[posts]
        console.log(`POSTS : ${posts}`)
        res.render('users/dashboard', {postArray});

    })
    .catch((e  =>next(e)));
    
   
})