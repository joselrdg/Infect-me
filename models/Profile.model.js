const mongoose = require('mongoose');
const User = require('./user.model');
// const ProfileBody = require('./Body.model');

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        profileUser: {
            type: Boolean,
            required: true
        },
        followers: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User"
        }],
        bkgImgBODY: {
            type: String,
            default: ''
        },
        bkgBODY: {
            type: String,
            default: '#001a33'
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
        titleOne: {
            type: String,
            default: 'Este es tu perfil'
        },
        subTitleOne: {
            type: String,
            default: 'Ponlo guapo en el panel de control'
        },
        textOne: String,
        titleTwo: String,
        subTitleTwo: String,
        textTwo: String,
        margin: String,
        font: {
            type: String,
            default: 'Amatic SC'
        },
        col2: Boolean,
        radius: {
            type: String,
            default: '100'
        },
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

profileSchema.virtual("playlist", {
    ref: "Playlist",
    foreignField: "profile",
    localField: "_id",
});

profileSchema.virtual("videolist", {
    ref: "Videolist",
    foreignField: "profile",
    localField: "_id",
});



const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;