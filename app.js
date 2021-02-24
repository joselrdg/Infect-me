require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const logger = require("morgan");
const routes = require("./routes/index.routes");
const passport = require ("passport");
//Session
const session = require("./config/session.config");


// database configuration
require("./config/db.config");
// passport configuration
require("./config/passport.config")
require('./config/hbs.config');


// Express config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(logger("dev"));
app.use(session);
// initialize and user passport session
app.use(passport.initialize());
app.use(passport.session()); 
app.set("views");
app.set("view engine", "hbs");
app.use(favicon('public/images/favicon.ico'));

// Web Title
app.locals.title = 'Infect-me';

// save and use user logged
app.use((req,res,next) => {
    req.currentUser = req.user;
    res.locals.currentUser = req.user;
    next();
});


// Routes
app.use('/', routes);
module.exports = app;


  