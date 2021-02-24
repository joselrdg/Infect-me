// User model here
const mongoose = require('mongoose');
const Post = require('./Post.model');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'Username is required.'],
            unique:true,
            trim:true
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
            required: true,
            default:0
          },
        role: {
            type:String,
            default:'USER'
        },
        social : {
            google: String
        },
        picture : {
            type: String,
            default: '../public/images/userIcon.png'
        },
        active: {
            type: Boolean,
            default:false
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
    },
    {
      timestamps: true
    },
    {
      toJSON: {
        virtuals: true,
      },
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

userSchema.virtual("posts", {
    ref: "Post",
    foreignField: "user",
    localField: "_id",
  });

const User = mongoose.model('User', userSchema);
module.exports = User;




