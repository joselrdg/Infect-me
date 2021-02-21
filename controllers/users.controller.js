const mongoose = require('mongoose');
const User = require("../models/user.model")

module.exports.register = (req, res, next) => {
    res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
}

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
    res.render('users/login');
}