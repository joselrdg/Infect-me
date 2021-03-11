const mongoose = require('mongoose');
const User = require('./user.model');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImg: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    image: { 
        type: String
    },
    video: { 
        type: String
    },
    tags: [String]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;