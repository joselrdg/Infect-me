// Passport Handler
const passport = require("passport");
// mongo handler
const mongoose= require("mongoose");

// Passport strategy Handler
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model')
// Session handler
//const session = require("session");
//const bcrypt = require("bcrypt");




passport.serializeUser((user,next) => {
    next(null,user._id)
});

passport.deserializeUser((id,next) => {
    User.findById(id)
    .then((user) => {
        next(null,user)
        
    })
    .catch((e) => next(e))

});

passport.use('local-Auth',new LocalStrategy (
    {
    usernameField: 'userName',
    passwordField: 'password'    
},
(userName,password,next) =>{
    User.findOne({userName : userName})
    .then((user) => {
        if (!user) {
            // user doesn't exist
            return next(null,false,{message: `User or password is not correct`});
        } else {
            //check password
            return user.checkPassword(password)
            .then( match => {
                if(match) {
                    //password correct
                    if (user.active) {
                        // user active logged
                        next(null,user);

                    } else 
                    {
                        // user doesn't active
                        next(null,false, {message: `Active your account. Check your email box`});
                    }
                } else {
                    // password incorrect
                    return next(null,false,{message: `User or password is not correct`});
                }
            })

        } 

        
       
    })
    .catch(next)
} // end second parameter 
) // localStrategy instance
);



