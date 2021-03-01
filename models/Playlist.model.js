const mongoose = require('mongoose');
const User = require('./user.model');

const playlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    ytbID:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tracks: {
        type: Number,
        required: true
    }
});

const Playlist = mongoose.model('Profile', playlistSchema);

module.exports = Playlist;