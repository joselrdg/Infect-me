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

const configPlaylists = (confg) => {
    if (confg = 'list') {
        return {
            part: ['snippet', 'contentDetails'],
            mine: true,
            headers: {}
        }
    }
}


const dataYtb = (res, confg) => {
    google.youtube({
        version: 'v3',
        auth: oauth2Client
    }).playlists.list(
        configPlaylists('list'),
        function (err, data, response) {
            if (err) {
                console.error('Error: ' + err);
                res.json({
                    status: "error"
                });
            }
            if (data) {
                res.json({
                    status: "ok",
                    data: data
                });
                console.log(data.data.items)
            }
            if (response) {
                console.log('Status code: ' + response.statusCode);
            }
        });
}

module.exports.ytbPlaylists = (req, res, next) => {
    // res.render('users/profile');
    oauth2Client.credentials = {
        access_token: req.user.social.google.access_token,
        refresh_token: req.user.social.google.refresh_token
    };
   dataYtb(res, 'playlists')
}



