require("dotenv").config();
// Passport Handler
const passport = require("passport");
// mongo handler
const mongoose = require("mongoose");

// Passport strategy Handler
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy

const User = require('../models/user.model')
// Session handler
// const session = require("session");
// const bcrypt = require("bcrypt");

const configGg = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || '/auth/google/callback',
    scope: ['https://www.googleapis.com/auth/youtube.readonly',
        , 'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'],
    authorizationParams: {
        access_type: 'offline'
    }
};




passport.serializeUser((user, next) => {
    next(null, user._id)
});

passport.deserializeUser((id, next) => {
    User.findById(id)
        .then((user) => {
            next(null, user)

        })
        .catch((e) => next(e))

});

passport.use('local-Auth', new LocalStrategy(
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    (userName, password, next) => {
        User.findOne({ userName: userName })
            .then((user) => {
                if (!user) {
                    // user doesn't exist
                    return next(null, false, { message: `User or password is not correct` });
                } else {
                    //check password
                    return user.checkPassword(password)
                        .then(match => {
                            if (match) {
                                //password correct
                                if (user.active) {
                                    // user active logged
                                    next(null, user);

                                } else {
                                    // user doesn't active
                                    next(null, false, { message: `Active your account. Check your email box` });
                                }
                            } else {
                                // password incorrect
                                return next(null, false, { message: `User or password is not correct` });
                            }
                        })
                }
            })
            .catch(next)
    } // end second parameter 
) // localStrategy instance
);


passport.use('google-auth', new GoogleStrategy(
    configGg,
    (accessToken, refreshToken, profile, next) => {
        const googleID = profile.id;
        console.log(profile)
        const email = profile.emails[0] ? profile.emails[0].value : undefined;
        if (googleID && email) {
            User.findOne({
                $or: [
                    { email: email },
                    { 'social.google.googleID': googleID }
                ]
            })
                .then(user => {
                    if (!user) {
                        const newUserInstance = new User({
                            userName: profile.displayName,                            
                            email,
                            password: 'Aa1' + mongoose.Types.ObjectId(),
                            social: {
                                google: {
                                    googleID,
                                    access_token: accessToken,
                                    refresh_token: refreshToken
                                }
                            },
                            picture: profile._json.picture,
                            active: true
                        })
                        console.log(newUserInstance)
                        return newUserInstance.save()
                            .then(newUser => next(null, newUser))
                    } else {
                        next(null, user)
                    }
                })
                .catch(next)
        } else {
            next(null, null, { error: 'Error conectando con Google OAuth' })
        }
    }
))

passport.use('youtube-auth', new YoutubeV3Strategy(
    configGg,
    (accessToken, refreshToken, profile, next) => {
        const googleID = profile.id;
        console.log(profile)
        // const email = profile.emails[0] ? profile.emails[0].value : undefined;
        if (googleID) {
            User.findOne({
                $or: [
                    { email: email },
                    { 'social.google.googleID': googleID }
                ]
            })
                .then(user => {
                    if (!user) {
                        const newUserInstance = new User({
                            userName: profile.displayName,                            
                            // email,
                            password: 'Aa1' + mongoose.Types.ObjectId(),
                            social: {
                                google: {
                                    googleID,
                                    access_token: accessToken,
                                    refresh_token: refreshToken
                                }
                            },
                            picture: profile._json.picture,
                            active: true
                        })
                        console.log(newUserInstance)
                        return newUserInstance.save()
                            .then(newUser => next(null, newUser))
                    } else {
                        next(null, user)
                    }
                })
                .catch(next)
        } else {
            next(null, null, { error: 'Error conectando con Google OAuth' })
        }
    }
))






