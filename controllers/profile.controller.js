const mongoose = require("mongoose");
// const Profile = require("../models/profile.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");

module.exports.edit = (req, res, next) => {

}

module.exports.doEdit = (req, res, next) => {

}


module.exports.addPlaylist = (req, res, next) => {
    const token = req.user.social.google.refresh_token;
    if (token) {
      Youtube.ytbPlaylists(req, res, next, 'lists')
    } else {
      res.render('users/controlPanel');
    }
  }

  module.exports.doAddPlaylist = (req, res, next) => {
    
    function renderWithErrors(errors) {
      res.status(400).render("users/addplaylist", { // miraaaaaaaaaaaaar
        errors: errors
      });
    }
    const playlist = req.body;
    console.log(playlist)
  
    Playlist.create(playlist)
      .then((p) => {
        console.log(`playlist añadida`)
        res.redirect('/addPlaylist')
      })
      .catch((e) => {
        if (e instanceof mongoose.Error.ValidationError) {  
          console.log(e.errors)   
          renderWithErrors(e.errors);
        } else {
          console.log('Error: ' + e)
          next(e);
        }
      });
  }