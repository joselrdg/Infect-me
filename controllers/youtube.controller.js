const Playlist = require("../models/Playlist.model");

const { google } = require('googleapis');
// console.log(google)
// const OAuth2 = google.auth.AuthPlus.OAuth2;
const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
};

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Playlists
const lists = () => {
    return {
        part: ['snippet', 'contentDetails'],
        mine: true,
        maxResults: 50,
        headers: {}
    }
}
// Playlists específica
const list = (id) => {
    return {
        part: 'contentDetails',
        id
    }
}


const configPlaylists = (confg) => {
    if (confg = 'lists') {
        return lists()
    }
}


const dataYtb = (req, res, confg) => {
    google.youtube({
        version: 'v3',
        auth: oauth2Client
    }).playlists.list(
        configPlaylists(confg),
        function (err, data, response) {
            if (err) {
                console.error('Error: ' + err);
                res.json({
                    status: "error"
                });
            }
            if (data) {
                let userData = {
                    userName: req.userName,
                    picture: req.picture,
                    items: data.data.items
                }
                res.render('users/addplaylist', userData);
            }
            if (response) {
                console.log('Status code: ' + response.statusCode);
            }
        });
}

module.exports.ytbPlaylists = (req, res, next, carcase) => {
    oauth2Client.credentials = {
        access_token: req.user.social.google.access_token,
        refresh_token: req.user.social.google.refresh_token
    };
    dataYtb(req.user, res, 'lists')
}



