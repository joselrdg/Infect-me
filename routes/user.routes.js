const router = require("express").Router();
const userController = require("../controllers/user.controller");
const secure = require("../middlewares/secure.middleware");

// user routes
router.get("/register", userController.register);

module.exports = router;