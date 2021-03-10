const mongoose = require('mongoose');
// const User = require('./user.model');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
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
    description: {
        type: String
    }
});

const Videolist = mongoose.model('Videolist', videoSchema);

module.exports = Videolist;