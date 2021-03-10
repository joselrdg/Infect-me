const mongoose = require("mongoose");
const User = require("../models/user.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model");
const ProfileBody = require("../models/Body.model");
const Videolist = require("../models/Video.model");

let userData = { userN: "", picture: "" };

module.exports.profile = (req, res, next) => {
  const idU = {
    user: req.currentUser._id,
    profileUser: 'true'
  }
  const userN = req.currentUser.userName;
  const picture = req.currentUser.picture;
  Profile.findOne(idU)
    // .populate('playlist')
    .populate('body')
    .then((p) => {
      if (p) {
        let data = p;
        data.userN = userN;
        data.picture = picture;
        // userData.playlist = p.playlist;
        res.render('users/profile', data);
      } else {
        const idP = {
          user: req.currentUser._id,
          profileUser: true
        }
        Profile.create(idP)
          .then((p) => {
            p.userN = userN;
            p.picture = picture;
            console.log('Perfil creado')
            res.render('users/profile', p);
          })
      }
    })
    .catch((e) => next(e));
}


module.exports.create = (req, res, next) => {
  const pData = {
    userN: req.currentUser.userName,
    picture: req.currentUser.picture
  }
  const query = { user: req.user._id }
  Profile.find(query)
    .then((p) => {
      pData.profilesU = p;
      res.render('users/controlPanel', pData);
    })
    .catch((e) => next(e));
}

module.exports.editHead = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((p) => {
      if (p) {
        p.userN = userData.userN;
        p.picture = userData.picture;
        p.editHead = true;
        console.log('Existe----------------------')
        res.render('users/editProfile', p);
      }
    })
    .catch((e) => next(e));
}


module.exports.doEditHead = (req, res, next) => {
  let body = req.body;
  console.log(req.body)
  body = checkBox(body);
  const query = { user: req.user._id };
  Profile.findOneAndUpdate(query, body, { new: true })
    .then((p) => {
      console.log('actualizado');
      res.redirect('/profile')
    })
    .catch((e) => { console.error(e); next(e) });
}

module.exports.createBody = ((req, res, next) => {
  let p = { createBody: true }
  p.userN = userData.userN;
  p.picture = userData.picture;
  res.render('users/editProfile', p);
})

module.exports.doCreateBody = (req, res, next) => {
  Profile.findOne({ user: req.user._id })
    .then((profile) => {
      let body = checkBox(req.body);
      console.log(req.body)
      body.profile = profile.id;
      ProfileBody.create(body)
        .then((p) => {
          console.log('Body creado');
          res.redirect('/profile')
        })
    })
    .catch((e) => {
      next(e);
    });
}

module.exports.findBody = (req, res, next) => {
  const id = { user: req.user._id };
  Profile.findOne(id)
    .then((profile) => {
      const id = { profile: profile.id }
      ProfileBody.find(id)
        .then((containers) => {
          console.log('Body encontrado');
          let p = { containers }
          p.userN = userData.userN;
          p.picture = userData.picture;
          p.selectBody = true;
          res.render('users/editProfile', p);
        })
    })
    .catch((e) => {
      next(e);
    });
}

module.exports.editBody = (req, res, next) => {
  const query = req.params.id;
  ProfileBody.findById(query)
    .then((p) => {
      p.userN = userData.userN;
      p.picture = userData.picture;
      p.editBody = true;
      console.log('Body encontrado');
      res.render('users/editProfile', p);
    })
    .catch((e) => {
      next(e);
    });
}


// terminar
module.exports.doEditBody = (req, res, next) => {
  let body = checkBox(req.body);
  console.log(req.body)
  const query = req.params.id;
  ProfileBody.findByIdAndUpdate(query, body, { new: true })
    .then((p) => {
      res.redirect('/control')
    })
    .catch((e) => next(e));
}

module.exports.deleteBody = (req, res, next) => {
  const id = req.params.id;
  ProfileBody.findByIdAndRemove(id)
    .then((p) => {
      console.log('Container eliminado')
      res.redirect('/control')
    })
    .catch((e) => next(e));
}

module.exports.library = (req, res, next) => {
  let userDat = {
    userName: req.user.userName,
    picture: req.user.picture
  }
  Profile.findById(req.params.id)
    .populate('playlist')
    .populate('videolist')
    .then((p) => {
      p.userName = req.user.userName;
      p.picture = req.user.picture;
      res.render('users/library', p);
    })
    .catch((e) => next(e));
}


module.exports.addPlaylist = (req, res, next) => {
  const token = req.user.social.google.refresh_token;
  if (token) {
    Youtube.ytbPlaylists(req, res, next, 'playlist')
  } else {
    res.render('users/controlPanel');
  }
}

module.exports.searchVideo  = (req, res, next) => {
  const search = req.params.search;
  const token = req.user.social.google.refresh_token;
  if (token) {
    Youtube.ytbPlaylists(req, res, next, search)
  } else {
    res.render('users/controlPanel');
  }
}

module.exports.doAddPlaylist = (req, res, next) => {
  const playlist = req.body;
  playlist.user = req.user._id
  Playlist.create(playlist)
    .then((p) => {
      console.log(`playlist añadida`)
      res.redirect(`/playlist/add/${req.body.profile}`)
    })
    .catch((e) => next(e));
}

module.exports.doAddPlayVideo = (req, res, next) => {
  const videolist = req.body;
  videolist.user = req.user._id
  Videolist.create(videolist)
    .then((p) => {
      console.log(`video añadido`)
      res.redirect(`/playlist/add/${req.body.profile}`)
    })
    .catch((e) => next(e));
}

module.exports.deletePlaylist = (req, res, next) => {
  const idP = req.params.id;
  let userDat = {
    userName: req.user.userName,
    picture: req.user.picture,
    profile: idP
  }
  Playlist.find({ profile: idP })
    .then((p) => { 
      userDat.items = p; 
      userDat.delete = true; 
      res.render('users/deletePlaylist', userDat) 
    })
    .catch((e) => next(e));

}

module.exports.doDeletePlaylist = (req, res, next) => {
  const id = req.body.profile;
  Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.redirect(`/playlist/delete/${id}`))
    .catch((e) => next(e));
}


const checkBox = (body) => {
  if (body.comment === 'on') {
    body.comment = true;
  } else {
    body.comment = false;
  };
  if (body.bkgImgON === 'on') {
    body.bkgImgON = true;
  } else {
    body.bkgImgON = false;
  };
  if (body.bkgImgCover === 'on') {
    body.bkgImgCover = true;
  } else {
    body.bkgImgCover = false;
  };
  if (body.imgOneON === 'on') {
    body.imgOneON = true;
  } else {
    body.imgOneON = false;
  };
  if (body.imgTwoON === 'on') {
    body.imgTwoON = true;
  } else {
    body.imgTwoON = false;
  };
  if (body.videoON === 'on') {
    body.videoON = true;
  } else {
    body.videoON = false;
  };
  if (body.col2 === 'on') {
    body.col2 = true;
  } else {
    body.col2 = false;
  };
  if (body.fluid === 'on') {
    body.fluid = true;
  } else {
    body.fluid = false;
  };
  return body;
};