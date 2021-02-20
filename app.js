require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const routes = require("./routes/index.routes");

const session = require("./config/session.config");

require("./config/db.config");
require('./config/hbs.config');


// Express config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(logger("dev"));
app.use(session);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use('/', routes);
module.exports = app;


  