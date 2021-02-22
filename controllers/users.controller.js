const mongoose = require('mongoose');
const User = require("../models/user.model");

module.exports.register = (req, res, next) => {

    res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    };
    
    User.findOne({ userName: req.body.userName })
        .then((user) => {
            if (user) {
                renderWithErrors({ userName: "User Already exists" })
            } else {
                User.create(req.body)
                    .then((user) => {

                        res.redirect('/')
                    })
                    .catch((e) => {
                        console.log(`CATCH BUSCA USUARIO`)
                        if (e instanceof mongoose.Error.ValidationError) {
                            console.log(`ERROR MONGOOSE`)
                          renderWithErrors(e.errors);
                        } else {
                            console.log(`OTRO ERROR`)
                          next(e);
                        }
                      });

            }

        })
        .catch((e) => next(e));
};


module.exports.login = (req, res, next) => {
    res.render('users/login');
}

module.exports.doLogin = (req, res, next) => {
}

module.exports.profile = (req, res, next) => {
    res.render('users/profile');
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('/');
}