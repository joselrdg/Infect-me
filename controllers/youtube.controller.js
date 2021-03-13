
const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_UR
};

const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model")
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_UR
);
const Youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
})

// const OAuth2 = google.auth.AuthPlus.OAuth2;


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

const videos = (search) => {
    return {
        part: ['snippet', 'id'],
        q: search,
        maxResults: 25
    }
}


const configPlaylists = (confg) => {
    if (confg == 'lists') {
        return lists()
    } else if (confg == video) {
        return
    }
}


const dataYtb = (req, res, next) => {
    Youtube.playlists.list(
        configPlaylists('lists'),
        function (err, data, response) {
            if (err) {
                console.error('Error: ' + err);
                res.json({
                    status: "error"
                });
            }
            if (data) {
                let arrayList = data.data.items;
                const idP = req.params.id;

                arrayList.forEach(element => {
                    element.profile = idP;
                });
                let userData = {
                    userName: req.user.userName,
                    picture: req.user.picture,
                    items: arrayList
                }
                res.render('users/addplaylist', userData);
            }
            if (response) {
                console.log('Status code: ' + response.statusCode);
            }
        });
}


const dataVideoYtb = (req, res, next, search) => {
    Youtube.search.list(
        videos(search),
        function (err, data, response) {
            if (err) {
                console.error('Error: ' + err);
                res.json({
                    status: "error"
                });
            }
            if (data) {
                let arrayList = data.data.items;
                const idP = req.params.id;
                let userData = {
                    userName: req.user.userName,
                    picture: req.user.picture,
                    items: arrayList,
                    profileId: idP
                }           
                res.json(userData);
            }
            if (response) {
                console.log('Status code: ' + response.statusCode);
            }
        });
}

module.exports.ytbPlaylists = (req, res, next, search) => {
    oauth2Client.credentials = {
        access_token: req.user.social.google.access_token,
        refresh_token: req.user.social.google.refresh_token
    };
    if (search == 'playlist') {
        dataYtb(req, res, next);
    } else {
        dataVideoYtb(req, res, next, search);
    }
}



