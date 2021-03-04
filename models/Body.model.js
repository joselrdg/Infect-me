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
    bkgImgON: Boolean,
    bkgImgCover: Boolean,
    backgroundColor: String,
    textColor: String,
    imgON: Boolean,
    image: String,
    imgWidth: String,
    imgHeight: String,
    video: String,
    videoON: Boolean,
    titleH: String,
    description: String,
    col2: Boolean,
    fluid: Boolean
})

const ProfileBody = mongoose.model('ProfileBody', profileBodySchema);

module.exports = ProfileBody;