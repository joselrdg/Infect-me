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
            enum: ['Active' , 'Inactive', 'Pending'],
            default:'Pending'
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

        }

   
    
})
const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;