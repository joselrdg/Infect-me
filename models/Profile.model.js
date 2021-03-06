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
        profileUser: { 
            type: String, 
            required: true 
        },
        bkgImgBODY: String,
        bkgBODY: String,
        txtColorBODY: String,
        backgroundImg: String,
        bkgImgON: Boolean,
        bkgImgCover: Boolean,
        backgroundColor: String,
        textColor: String,
        imgOneON: Boolean,
        imageOne: String,
        imgWidthOne: String,
        imgHeightOne: String,
        imgTwoON: Boolean,
        imageTwo: String,
        imgWidthTwo: String,
        imgHeightTwo: String,
        video: String,
        videoON: Boolean,
        titleOne: String,
        subTitleOne: String,
        textOne: String,
        titleTwo: String,
        subTitleTwo: String,
        textTwo: String,
        margin: String,
        col2: Boolean,
        fluid: Boolean
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