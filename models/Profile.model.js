const mongoose = require('mongoose');
const User = require('./user.model');
const ProfileBody = require('./Body.model');

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
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
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

profileSchema.virtual("body", {
    ref: "ProfileBody",
    foreignField: "profile",
    localField: "_id",
});


const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;