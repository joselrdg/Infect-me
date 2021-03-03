const mongoose = require("mongoose");
const User = require('./user.model');

const friendSchema = new mongoose.Schema ({
    
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        friend:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['Active' , 'Inactive', 'pending'],
            default:'Pending'
        }
   
    
})
const Friend = mongoose.model('Friend', friendsSchema);

module.exports = Friend;