
// Session handle
const session = require("session");
const MongoStore = require("conect-mongo")(session);
const bcrypt = require("bcrypt");
const User = require('../models/user.model')

// Passport Handle
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

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
(req,res,next) =>{
    User.findOne(userName)
    .then((user) => {
        if (!user) {
            return next(null,false,{message: `User or password is not correct`});
        }

        // VALIDAR LA CONSTRASEÑA UTILIZANDO BCRYPT
        next(null,user);
    })
}
)
);



