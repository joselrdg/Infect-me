const mongoose = require('mongoose');
const User = require('./user.model');

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        head: {
            backgroundImg: {
                type: String
            },
            backgroundColor: {
                type: String
            },
            textColor: {
                type: String
            },
            image: {
                type: String
            },
            video: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            layout: {
                type: String
            }
        }
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

const profileBodySchema = new mongoose.Schema({
    profile: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Profile",
        required: true
    },
    body: [{
        division: [{
            background: {
                type: String
            },
            image: {
                type: String
            },
            video: {
                url: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            layout: [String]
        }]
    }]
})

profileSchema.virtual("body", {
    ref: "ProfileBody",
    foreignField: "profile",
    localField: "_id",
});

const ProfileBody = mongoose.model('ProfileBody', profileBodySchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = ProfileBody;
module.exports = Profile;