const mongoose = require('mongoose');
const ProfileBody = require("../models/Profile.model");

const commentsSchema = new mongoose.Schema(
    {
        body: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Profile",
            required: true
        },
        users: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        image: String        
    }
)



const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;