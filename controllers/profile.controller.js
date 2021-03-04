const mongoose = require("mongoose");
const User = require("../models/user.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model");
const ProfileBody = require("../models/Body.model");
// let userData = {};

module.exports.profile = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    // .populate('playlist')
    .populate('body')
    .then((p) => {
      //  let userData = p;
      // userData.playlist = p.playlist;
      // console.log(userData)
      res.render('users/profile', p);
    })
    .catch((e) => next(e));
}


module.exports.create = (req, res, next) => {
  res.render('users/controlPanel');
}

module.exports.editHead = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((p) => {
      if (p) {
        let profile = p
        profile.editHead = true,
          console.log('Existe----------------------')
        res.render('users/editProfile', profile);
      } else {
        Profile.create({ user: req.user._id })
          .then((profile) => {
            console.log('Perfil creado ----------------------')
            res.render('users/editProfile', { editHead: true });
          })
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => next(e));
}


module.exports.doEditHead = (req, res, next) => {
  let body = req.body;
  body = checkBox(body);
  console.log(body)
  const query = { user: req.user._id };
  Profile.findOneAndUpdate(query, body, { new: true })
    .then((p) => {
      console.log('actualizado ---------------');
      res.redirect('/profile')
    })
    .catch((e) => { console.error(e); next(e) });
}

module.exports.createBody = ((req, res, next) => {
  res.render('users/editProfile', { createBody: true });
})

module.exports.doCreateBody = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((profile) => {
      let body = req.body;
      body = checkBox(body);
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
}

module.exports.findBody = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((profile) => {
      console.log(profile)
      ProfileBody.find({ profile: profile.id })
        .then((containers) => {
          console.log('Body encontrado ---------------');
          res.render('users/editProfile', { containers, selectBody: true });
        })
    })
    .catch((e) => {
      next(e);
    });
}

module.exports.editBody = (req, res, next) => {
  const query = req.params.id;
  console.log(query)
  ProfileBody.findById(query)
    .then((container) => {
      let body = container;
      body.editBody = true;
      console.log('Body encontrado ---------------');
      res.render('users/editProfile', body);
    })
    .catch((e) => {
      next(e);
    });
}


// terminar
module.exports.doEditBody = (req, res, next) => {
  let body = req.body
  body = checkBox(body);
  const query = req.params.id;
  ProfileBody.findByIdAndUpdate(query, body, { new: true })
    .then((p) => {
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


const checkBox = (body) => {
  if (body.bkgImgON === 'on') {
    body.bkgImgON = true;
  } else {
    body.bkgImgON = false;
  }
  if (body.bkgImgCover === 'on') {
    body.bkgImgCover = true;
  } else {
    body.bkgImgCover = false;
  }
  if (body.imgON === 'on') {
    body.imgON = true;
  } else {
    body.imgON = false;
  }
  if (body.videoON === 'on') {
    body.videoON = true;
  } else {
    body.videoON = false;
  }
  if (body.col2 === 'on') {
    body.col2 = true;
  } else {
    body.col2 = false;
  }
  if (body.fluid === 'on') {
    body.fluid = true;
  } else {
    body.fluid = false;
  }
  return body;
}