const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const secure = require("../middlewares/secure.middleware");

// Misc
router.get("/", miscController.home);

module.exports = router;