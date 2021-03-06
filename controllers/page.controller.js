const mongoose = require("mongoose");
const User = require("../models/user.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model");
const ProfileBody = require("../models/Body.model");
const Pages = require("../models/Pages.model");
let userData = { userN: "", picture: "" };

module.exports.pages = (req, res, next) => {
    const id = { user: req.user._id }
    Profile.find(id)
        .then((p) => {
            let pages = {pages: p}
            pages.userN = req.currentUser.userName;
            pages.picture = req.currentUser.picture;
            res.render('users/pages', pages);
        })
        .catch((e) => next(e));
}

module.exports.page = (req, res, next) => {
    const id = req.params.id
    Profile.findById(id)
        .populate('body')
        .then((p) => {
            p.userN = req.currentUser.userName;
            p.picture = req.currentUser.picture
            res.render('users/profile', p);
        })
        .catch((e) => next(e));
}

module.exports.create = (req, res, next) => {
    let p = { createPage: true };
    p.userN = req.currentUser.userName;
    p.picture = req.currentUser.picture;
    res.render('users/pageform', p);
}

module.exports.doCreate = (req, res, next) => {
    const idU = { 
        user: req.user.id,
        profileUser: false
    }
    const userN = req.currentUser.userName;
    const picture = req.currentUser.picture;
    Profile.create(idU)
        .then((p) => {
            console.log('perfil creado')
            let data = req.body;
            data.user = idU.user;
            data.profile = p._id;
            Pages.create(data)
                .then((p) => {
                    console.log('pagina creada')
                    res.redirect('/page/edit')
                })
        })
        .catch((e) => next(e));
}

module.exports.findPages = (req, res, next) => {
    const id = { user: req.user._id }
    Pages.find(id)
    .populate('profile')
        .then((containers) => {
            if (containers[0]) {
                containers.forEach(element => {
                    element.backgroundImg = element.profile.backgroundImg;
                    element.backgroundColor = element.profile.backgroundColor;
                    element.backgroundColor = element.profile.backgroundColor;
                    element.textColor = element.profile.textColor;
                    element.idProfile = element.profile._id;
                });
                console.log('El usuario tiene paginas')
                let p = { containers }
                p.userN = req.currentUser.userName;
                p.picture = req.currentUser.picture;
                p.selectBody = true;
                p.selectPageBody = true;
                res.render('users/editProfile', p);
            } else {
                console.log('El usuario no tiene')
                res.redirect('/page/create')
            }
        })
        .catch((e) => next(e));
}

module.exports.editHead = (req, res, next) => {
    const query = {
        _id: req.params.id,
        user: req.currentUser.id
    }
    Profile.findOne(query)
        .then((p) => {
            p.userN = req.currentUser.userName;
            p.picture = req.currentUser.picture;
            p.editPageHead = true;
            console.log('Existe----------------------')
            res.render('users/editProfile', p);
        })
        .catch((e) => next(e));
}


module.exports.doEditHead = (req, res, next) => {
    let body = req.body;
    body = checkBox(body);
    const query = { _id: req.params.id, user: req.currentUser.id };
    Profile.findOneAndUpdate(query, body, { new: true })
        .then((p) => {
            console.log('actualizado ---------------');
            res.redirect(`/page/${req.params.id}`)
        })
        .catch((e) => { console.error(e); next(e) });
}

module.exports.createBody = ((req, res, next) => {
    let p = { createPageBody: true }
    p.userN = req.currentUser.userName;
    p.picture = req.currentUser.picture;
    p.profileId = req.params.id;
    res.render('users/editProfile', p);
})

module.exports.doCreateBody = (req, res, next) => {
    const query = { _id: req.params.id, user: req.currentUser._id }
    Profile.findOne({ _id: req.params.id, user: req.currentUser._id })
        .then((profile) => {
            let body = req.body;
            body = checkBox(body);
            body.profile = profile._id;
            ProfileBody.create(body)
                .then((p) => {
                    console.log('Body creado ---------------');
                    res.redirect(`/page/${query._id}`)
                })
        })
        .catch((e) => {
            next(e);
        });
}

module.exports.findBody = (req, res, next) => {
    const query = { _id: req.params.id, user: req.currentUser._id }
    Profile.findOne(query)
        .then((profile) => {
            const id = { profile: profile.id }
            ProfileBody.find(id)
                .then((containers) => {
                    if(containers[0]){
                    console.log('Body encontrado ---------------');
                    let p = { containers }
                    p.userN = req.currentUser.userName;
                    p.picture = req.currentUser.picture;
                    p.selectBody = true;
                    res.render('users/editProfile', p);
                }else {
                    res.redirect('/control')  
                }
                })
        })
        .catch((e) => {
            next(e);
        });
}

module.exports.deletePage = (req, res, next) => {
    let query = { profile: req.params.id }
    ProfileBody.deleteMany(query)
        .then((p) => {
            console.log('Container eliminado')
            Pages.deleteOne(query)
                .then((p) => {
                    console.log('Página eliminada')
                    query.user = req.currentUser._id
                    Profile.findOneAndDelete(query)
                        .then((p) => {
                            console.log('Perfil eliminado')
                            res.redirect('/control')
                        })
                })
        })
        .catch((e) => next(e));
}


const checkBox = (body) => {
    if (body.bkgImgON === 'on') {
        body.bkgImgON = true;
    } else {
        body.bkgImgON = false;
    }
    if (body.bkgImgCover === 'on') {
        body.bkgImgCover = true;
    } else {
        body.bkgImgCover = false;
    }
    if (body.imgOneON === 'on') {
        body.imgOneON = true;
    } else {
        body.imgOneON = false;
    }
    if (body.imgTwoON === 'on') {
        body.imgTwoON = true;
    } else {
        body.imgTwoON = false;
    }
    if (body.videoON === 'on') {
        body.videoON = true;
    } else {
        body.videoON = false;
    }
    if (body.col2 === 'on') {
        body.col2 = true;
    } else {
        body.col2 = false;
    }
    if (body.fluid === 'on') {
        body.fluid = true;
    } else {
        body.fluid = false;
    }
    return body;
}