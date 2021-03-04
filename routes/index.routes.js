const router = require("express").Router();
const passport = require('passport')
const miscController = require("../controllers/misc.controller");
const usersController = require('../controllers/users.controller');
const postsController = require("../controllers/posts.controller");
const profileController = require("../controllers/profile.controller");
const youtubeController = require("../controllers/youtube.controller");
const dashboardController = require("../controllers/dashboard.controller");
const secure = require("../middlewares/secure.middleware");
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
// Misc
router.get("/", secure.isNotAuthenticated, miscController.home);
// router.get("/", miscController.home);

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register', secure.isNotAuthenticated, usersController.doRegister)
router.get('/dashboard',secure.isAuthenticated, dashboardController.showDashboard)

router.get('/login', secure.isNotAuthenticated, usersController.login)
router.post('/login', secure.isNotAuthenticated, usersController.doLogin)
// router.get('/auth/google', passport.authenticate('google-auth'))
router.get('/auth/youtube', passport.authenticate('youtube-auth'))
router.get('/auth/google/callback', usersController.doLoginGoogle)
// router.get('/auth/google/callback', usersController.youtube)

router.get('/youtube/playlists', secure.isAuthenticated, youtubeController.ytbPlaylists)


router.get('/activate/:activationToken',secure.isNotAuthenticated, usersController.activate)

router.post('/logout', secure.isAuthenticated, usersController.logout)

router.get('/control', secure.isAuthenticated, usersController.create)
router.get("/playlist/add", secure.isAuthenticated, profileController.addPlaylist);
router.post("/playlist/add", secure.isAuthenticated, profileController.doAddPlaylist);
router.get("/playlist/delete", secure.isAuthenticated, profileController.deletePlaylist);
router.post("/playlist/:id/delete", secure.isAuthenticated, profileController.doDeletePlaylist);
// profile
router.get('/profile', secure.isAuthenticated, profileController.profile)
router.get('/profile/library', secure.isAuthenticated, profileController.library)
router.get("/profile/edit", secure.isAuthenticated, profileController.edit);
router.post("/profile/edit/head", secure.isAuthenticated, profileController.doEditHead);
router.post("/profile/create/body", secure.isAuthenticated, profileController.doCreateBody);
router.get("/profile/edit/body/:id", secure.isAuthenticated, profileController.findPBody);
router.post("/profile/edit/body/:id", secure.isAuthenticated, profileController.doEditPBody);


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