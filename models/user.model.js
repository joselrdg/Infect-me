// User model here
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Profile = require("../models/Profile.model");
const Post = require('./Post.model');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: 'You need to add an email',
            lowercase: true,
            match: [EMAIL_PATTERN, 'Invalid email'],
            trim: true
        },
        password: {
            type: String,
            required: 'The password is required',
            match: [PASSWORD_PATTERN, 'Your password must contain at least 1 number, 1 uppercase, 1 lowercase and 8 characters']
        },
        age: {
            type: Number,
            // required: true,
        },
        role: {
            type: String,
            default: 'USER'
        },
        social: {
            google: {
                googleID: String,
                access_token: String,
                refresh_token: String,
            }
        },
        picture: {
            type: String,
            default: './images/userIcon.png'
        },
        active: {
            type: Boolean,
            default: false
        },
        activationToken: {
            type: String,
            default: () => {
                return (
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
                )
            }

        },
        // playlist: [{type: Schema.Types.ObjectId, ref: 'Playlist'}]
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
}
)

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.pre('save', function (next) {
    const user = this

    if (user.isModified('password')) {
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then(hash => {
                this.password = hash
                next()
            })
    } else {
        next()
    }
})

// userSchema.virtual("posts", {
//     ref: "Post",
//     foreignField: "user",
//     localField: "_id",
// });

userSchema.virtual("profile", {
    ref: "Profile",
    foreignField: "user",
    localField: "_id",
});

userSchema.virtual("playlist", {
    ref: "Playlist",
    foreignField: "user",
    localField: "_id",
});

const User = mongoose.model('User', userSchema);
module.exports = User;




