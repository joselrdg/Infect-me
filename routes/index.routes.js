const router = require("express").Router();
const passport = require('passport')
const miscController = require("../controllers/misc.controller");
const usersController = require('../controllers/users.controller');
const postsController = require("../controllers/posts.controller");
const profileController = require("../controllers/profile.controller");
const youtubeController = require("../controllers/youtube.controller");
const secure = require("../middlewares/secure.middleware");
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
// Misc
router.get("/", secure.isNotAuthenticated, miscController.home);
// router.get("/", miscController.home);

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register', secure.isNotAuthenticated, usersController.doRegister)

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
router.get("/addPlaylist", secure.isAuthenticated, profileController.addPlaylist);
router.post("/addPlaylist", secure.isAuthenticated, profileController.doAddPlaylist);
// profile
router.get('/profile', secure.isAuthenticated, usersController.profile)
router.get("/profile/:id/edit", secure.isAuthenticated, profileController.edit);
router.post("/profile/:id/edit", secure.isAuthenticated, profileController.doEdit);


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