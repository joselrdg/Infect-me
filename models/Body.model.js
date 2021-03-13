const mongoose = require('mongoose');
const Profile = require("../models/Profile.model");

const profileBodySchema = new mongoose.Schema(
    {
        profile: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Profile",
            required: true
        },
        followBody: {
            type: Boolean,
            default: true
        },
        comment: Boolean,
        bkgImgBODY: String,
        bkgBODY: {
            type: String,
            default: '#001a33'
        },
        bkgBodycolorOn: {
            type: Boolean,
            default: true
        },
        txtColorBODY: {
            type: String,
            default: '#fdcf1b'
        },
        backgroundImg: {
            type: String,
            default: '/images/influencer.jpg'
        },
        bkgImgON: {
            type: Boolean,
            default: true
        },
        bkgImgCover: {
            type: Boolean,
            default: true
        },
        backgroundColor: String,
        textColor: {
            type: String,
            default: '#fdcf1b'
        },
        imgOneON: {
            type: Boolean,
            default: true
        },
        imageOne: {
            type: String,
            default: '/images/unicorn.png'
        },
        imgWidthOne: {
            type: String,
            default: '200'
        },
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
        font: String,
        col2: Boolean,
        radius: String,
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
)

profileBodySchema.virtual("comments", {
    ref: "Comments",
    foreignField: "body",
    localField: "_id",
});

const ProfileBody = mongoose.model('ProfileBody', profileBodySchema);

module.exports = ProfileBody;