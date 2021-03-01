const router = require("express").Router();
const passport = require('passport')
const miscController = require("../controllers/misc.controller");
const usersController = require('../controllers/users.controller');
const postsController = require("../controllers/posts.controller");
const dashboardController = require("../controllers/dashboard.controller");
const secure = require("../middlewares/secure.middleware");
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
// Misc
router.get("/", secure.isAuthenticated, miscController.home);
// router.get("/", miscController.home);

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register', secure.isNotAuthenticated, usersController.doRegister)
router.get('/dashboard',secure.isAuthenticated, dashboardController.showDashboard)

router.get('/login', secure.isNotAuthenticated, usersController.login)
router.post('/login', secure.isNotAuthenticated, usersController.doLogin)
router.get('/auth/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/auth/google/callback', usersController.doLoginGoogle)

router.get('/activate/:activationToken',secure.isNotAuthenticated, usersController.activate)

router.post('/logout', secure.isAuthenticated, usersController.logout)

router.get('/profile', secure.isAuthenticated, usersController.profile)


// posts
router.get("/posts/list", secure.isAuthenticated, postsController.list);
router.get("/posts/create", secure.isAuthenticated, postsController.create);
router.post("/posts/create", secure.isAuthenticated, postsController.doCreate);
router.get("/posts/:id/edit", secure.isAuthenticated, postsController.edit);
router.post("/posts/:id/edit", secure.isAuthenticated, postsController.doEdit);
router.get("/posts/:id/delete", secure.isAuthenticated, postsController.delete);
router.post("/posts/:id/delete", secure.isAuthenticated, postsController.doDelete);
router.get("/posts/:id", secure.isAuthenticated, postsController.detail);

module.exports = router;