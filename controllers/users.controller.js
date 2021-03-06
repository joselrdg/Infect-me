const mongoose = require('mongoose');
const passport = require('passport');
const User = require("../models/user.model");
const mailer = require("../config/nodemailer.config");

const { google } = require('googleapis');
// console.log(google)
// const OAuth2 = google.auth.AuthPlus.OAuth2;
const config = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI || '/auth/google/callback'
};

const oauth2Client = new google.auth.OAuth2(
  config.clientID,
  config.clientSecret,
  config.callbackURL
);

let userData = {
  userName: '',
  picture: ''
}

const confgUserData = (name, picture) => {
  userData.userName = name;
  userData.picture = picture;
}


module.exports.register = (req, res, next) => {

  res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
  function renderWithErrors(errors) {
    console.log(errors)
    res.status(400).render('users/register', {
      errors: errors,
      user: req.body
    })
  };

  User.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        renderWithErrors({ userName: "User Already exists" })
      } else {
        User.create(req.body)
          .then((user) => {
            mailer.sendMail(user.email, user.activationToken);
            res.redirect('/')
          })
          .catch((e) => {
            if (e instanceof mongoose.Error.ValidationError) {
              console.log(`ERROR MONGOOSE`)
              renderWithErrors(e.errors);
            } else {
              next(e);
            }
          });

      }

    })
    .catch((e) => next(e));
};


module.exports.login = (req, res, next) => {
  res.render('users/login');
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-Auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('users/login', { user: req.body, error: validations.error });
    } else {
      req.login(user, loginErr => {
        if (loginErr) { next(loginErr) }
        else { res.redirect('/profile') }
      })
    }
  })(req, res, next);
};


module.exports.doLoginGoogle = (req, res, next) => {
  if (req.user) {
    console.log('estamos en login google con usuario')
    passport.authenticate('youtube', (error, user, validations) => {
      console.log(user)
    })
  } else {
    passport.authenticate('google-auth', (error, user, validations) => {
      if (error) {
        next(error);
      } else if (!user) {
        res.status(400).render('users/login', { user: req.body, error: validations });
      } else {
        req.login(user, loginErr => {
          if (loginErr) { next(loginErr) }
          else { res.redirect('/profile') }
        })
      }
    })(req, res, next)
  }
}

module.exports.create = (req, res, next) => {
  res.render('users/controlPanel');
}

module.exports.profile = (req, res, next) => {
  const { userName, picture } = req.user;
  confgUserData(userName, picture)
  // const token = req.user.social.google.refresh_token;
  // if (token) {
  //   Youtube.ytbPlaylists(req, res, next, 'lists')
  // } else {
  res.render('users/profile', userData);
  // }
}

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
}

module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { activationToken: req.params.activationToken },
    {
      active: true,
      activationToken: 'active'
    }
  )
    .then((user) => {
      if (user) {
        res.render('users/login',
          {
            user: req.body,
            message: "Congrats. You can already login session"
          })
      }
    })
}