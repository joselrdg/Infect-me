const mongoose = require('mongoose');
const Profile = require("../models/Profile.model");

const profileBodySchema = new mongoose.Schema({
    profile: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Profile",
        required: true
    },
    bkgBODY: String,
    txtColorBODY: String,
    backgroundImg: String,
    bkgImgON: String,
    bkgImgCover: String,
    backgroundColor: String,
    textColor: String,
    imgON: String,
    image: String,
    imgWidth: String,
    imgHeight: String,
    video: String,
    videoON: String,
    title: String,
    description: String,
    layout: String,
    fluid: String
})

const ProfileBody = mongoose.model('ProfileBody', profileBodySchema);

module.exports = ProfileBody;