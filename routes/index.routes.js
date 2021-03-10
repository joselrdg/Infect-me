const router = require("express").Router();
const passport = require('passport')
const miscController = require("../controllers/misc.controller");
const usersController = require('../controllers/users.controller');
const postsController = require("../controllers/posts.controller");
const profileController = require("../controllers/profile.controller");
const pageController = require("../controllers/page.controller");
const youtubeController = require("../controllers/youtube.controller");
const dashboardController = require("../controllers/dashboard.controller");
const secure = require("../middlewares/secure.middleware");
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
// Misc
router.get("/", secure.isNotAuthenticated, miscController.home);
// router.get("/", miscController.home);

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register', secure.isNotAuthenticated, usersController.doRegister)
router.get('/dashboard',secure.isAuthenticated, dashboardController.showDashboard)
router.get('/dashboard/findUser/:user',secure.isAuthenticated, dashboardController.findUser)
router.post('/dashboard/createfriend',secure.isAuthenticated, dashboardController.friendEmail)
router.get('/dashboard/activate/:activationToken',secure.isNotAuthenticated, dashboardController.activateFriend)

router.get('/login', secure.isNotAuthenticated, usersController.login)
router.post('/login', secure.isNotAuthenticated, usersController.doLogin)
// router.get('/auth/google', passport.authenticate('google-auth'))
router.get('/auth/youtube', passport.authenticate('youtube-auth'))
router.get('/auth/google/callback', usersController.doLoginGoogle)
// router.get('/auth/google/callback', usersController.youtube)

router.get('/youtube/playlists', secure.isAuthenticated, youtubeController.ytbPlaylists)


router.get('/activate/:activationToken', secure.isNotAuthenticated, usersController.activate)

router.post('/logout', secure.isAuthenticated, usersController.logout)

router.get('/control', secure.isAuthenticated, profileController.create)
// router.get("/playlist/add/playlist/:id", secure.isAuthenticated, profileController.addPlaylist);
router.get("/playlist/add/:id", secure.isAuthenticated, profileController.addPlaylist);
router.post("/playlist/add", secure.isAuthenticated, profileController.doAddPlaylist);
router.post("/video/add", secure.isAuthenticated, profileController.doAddPlayVideo);
router.get("/playlist/search/:id/:search", secure.isAuthenticated, profileController.searchVideo);
router.get("/playlist/delete/:id", secure.isAuthenticated, profileController.deletePlaylist);
router.post("/playlist/:id/delete", secure.isAuthenticated, profileController.doDeletePlaylist);
router.get('/library/:id', secure.isAuthenticated, profileController.library)

// profile
router.get('/profile', secure.isAuthenticated, profileController.profile)
router.get("/profile/edit/head", secure.isAuthenticated, profileController.editHead);
router.post("/profile/edit/head", secure.isAuthenticated, profileController.doEditHead);
router.get("/profile/create/body", secure.isAuthenticated, profileController.createBody);
router.post("/profile/create/body", secure.isAuthenticated, profileController.doCreateBody);
router.get("/profile/edit/body", secure.isAuthenticated, profileController.findBody);
router.get("/profile/edit/body/:id", secure.isAuthenticated, profileController.editBody);
router.post("/profile/edit/body/:id", secure.isAuthenticated, profileController.doEditBody);
router.get("/profile/delete/body/:id", secure.isAuthenticated, profileController.deleteBody);

// //pages
router.get("/pages", secure.isAuthenticated, pageController.pages);
router.get("/page/create", secure.isAuthenticated, pageController.create);
router.post("/page/create", secure.isAuthenticated, pageController.doCreate);
router.get('/page/edit', secure.isAuthenticated, pageController.findPages)
router.get("/page/edit/head/:id", secure.isAuthenticated, pageController.editHead);
router.post("/page/edit/head/:id", secure.isAuthenticated, pageController.doEditHead);
router.get("/page/create/body/:id", secure.isAuthenticated, pageController.createBody);
router.post("/page/create/body/:id", secure.isAuthenticated, pageController.doCreateBody);
router.get("/page/edit/body/:id", secure.isAuthenticated, pageController.findBody);
router.get("/page/delete/:id", secure.isAuthenticated, pageController.deletePage);
router.get("/page/:id", secure.isAuthenticated, pageController.page);

router.get("/follow/:id", secure.isAuthenticated, pageController.follow);
router.get("/stopfollow/:id", secure.isAuthenticated, pageController.unfollow);
router.post("/comment", secure.isAuthenticated, pageController.doComment)
router.get("/comments/:id", secure.isAuthenticated, pageController.comments)

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