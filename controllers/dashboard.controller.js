const mongoose =require ("mongoose");
const User = require("../models/user.model");
const Post = require("../models/Post.model");


module.exports.showDashboard = ( (req, res, next) => {
  
  Post.find({user: req.currentUser._id})
    .then((posts) => {
      
        
       
        res.render('users/dashboard', {posts});

    })
    .catch((e  =>next(e)));
    
   
})