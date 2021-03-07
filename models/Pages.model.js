const mongoose = require('mongoose');
const User = require('./user.model');

const pagesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        profile: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Profile',
            required: true
        },
        titleOne: {
            type: String,
            required: true
        },
        subTitleOne: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        tags: [{
            type: String,
            required: true
        }],
        bkgColor: {
            type: String,
            required: true
        },
        textColor: {
            type: String,
            required: true
        },
    }
);


const Pages = mongoose.model('Pages', pagesSchema);

module.exports = Pages;