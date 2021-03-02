const mongoose = require('mongoose');
const User = require('./user.model');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ytbID: {
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

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;