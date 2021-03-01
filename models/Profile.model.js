const mongoose = require('mongoose');
const User = require('./user.model');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    layout: [String]
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;