const mongoose = require("mongoose");
const User = require("../models/user.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model");
const ProfileBody = require("../models/Body.model");
let userData = {};

module.exports.profile = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    // .populate('playlist')
    .populate('body')
    .then((p) => {
      userData = p;
      // userData.playlist = p.playlist;
      res.render('users/profile', p);
    })
    .catch((e) => next(e));
}

module.exports.edit = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .populate('body')
    .then((profile) => {
      if (profile) {
        userData = profile
        console.log('Existe----------------------')
        res.render('users/editProfile', userData);
      } else {
        Profile.create({ user: req.user._id })
          .then((profile) => {
            console.log('Perfil creado ----------------------')
            res.render('users/editProfile');
          })
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => next(e));
}

module.exports.doEditHead = (req, res, next) => {
  const body = req.body;
  const query = { user: req.user._id };
  Profile.findOneAndUpdate(query, body, { new: true })
    .then((p) => {
      console.log('actualizado ---------------');
      res.redirect('/profile')
    })
    .catch((e) => next(e));
}

module.exports.doCreateBody = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((profile) => {
      console.log(profile.id)
      const body = req.body;
      body.profile = profile.id;
      ProfileBody.create(body)
        .then((p) => {
          console.log('Body creado ---------------');
          console.log(p)
          res.redirect('/profile')
        })
    })
    .catch((e) => {
      next(e);
    });
  // const body = { profile: req.body._id, body: req.body }
  // ProfileBody.create(body)
  //   .then((p) => {
  //     console.log('Body creado ---------------');
  //     console.log(p)
  //     res.redirect('/profile')
  //   })
  //   .catch((e) => next(e));
}

module.exports.findPBody = ((req, res, next) => {
  console.log('estamos en find body -------------------')
  console.log(req.params)
  ProfileBody.findById(req.params.id)
    .then((profile) => {
      if (profile) {
        let userData = profile
        userData.editBody = true;
        console.log('Existe----------------------')
        res.render('users/editProfile', userData);
      } else {
        console.log('No encuentra el usuario')
      }
    })
    .catch((e) => next(e));
})


// terminar
module.exports.doEditPBody = (req, res, next) => {
  console.log('estamos en edddddddddditt p bodyyyyyyyyyyyyyyyyy')
  const body = req.body
  console.log(body)
  const query = req.params.id;
  ProfileBody.findByIdAndUpdate(query, body, { new: true })
    .then((p) => {
      console.log('actualizado ---------------');
      console.log(p);
      res.redirect('/profile')
    })
    .catch((e) => next(e));
}

module.exports.library = (req, res, next) => {
  userData = {
    userName: req.user.userName,
    picture: req.user.picture
  }
  User.findById(req.user._id)
    .populate('playlist')
    .then((p) => {
      userData.playlist = p.playlist
      res.render('users/library', userData);
    })
    .catch((e) => next(e));
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
    res.status(400).render("users/addplaylist", {
      errors: errors
    });
  }
  const playlist = req.body;
  playlist.user = req.user._id


  Playlist.create(playlist)
    .then((p) => {
      console.log(`playlist añadida`)
      res.redirect('/profile')
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

module.exports.deletePlaylist = (req, res, next) => {
  userData = {
    userName: req.userName,
    picture: req.picture
  }
  Playlist.find({ user: req.user._id })
    .then((p) => { userData.items = p; userData.delete = true; res.render('users/deletePlaylist', userData) })
    .catch((e) => next(e));

}

module.exports.doDeletePlaylist = (req, res, next) => {
  Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/playlist/delete"))
    .catch((e) => next(e));
}