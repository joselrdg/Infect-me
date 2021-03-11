const mongoose = require("mongoose");
const User = require("../models/user.model");
const Youtube = require("../controllers/youtube.controller");
const Playlist = require("../models/Playlist.model");
const Profile = require("../models/Profile.model");
const Comment = require("../models/Comments.model");
const ProfileBody = require("../models/Body.model");
const Pages = require("../models/Pages.model");
const categories = require("../public/categories")
let userData = { userN: "", picture: "" };

module.exports.doComment = (req, res, next) => {
    const query = {
        body: req.body.body,
        user: req.user._id,
        name: req.user.userName,
        comment: req.body.comment
    }
    if (req.body.comment) {
        Comment.create(query)
            .then(p => {
                console.log('comentario creado')
                return;
            })
            .catch((e) => next(e));
    } else {
        console.log('NO ESTA')
        return;
    }
}

module.exports.comments = (req, res, next) => {
    const query = {
        body: req.params.id
    }
    console.log('estamos en comments')
    Comment.find(query)
        .then(comments => {
            console.log(comments)
            res.json(comments)
        })
        .catch((e) => next(e));
}

module.exports.follow = (req, res, next) => {
    const id = req.params.id;
    const idU = req.user._id;
    Profile.findByIdAndUpdate(id, { followers: idU })
        .then((p) => {
            console.log('seguidor añadido')
            res.redirect(`/page/${id}`);
        })
        .catch((e) => next(e));
}

module.exports.unfollow = (req, res, next) => {
    const id = req.params.id;
    const idU = req.user._id;
    Profile.findByIdAndUpdate(id, { $pull: { followers: idU } })
        .then((p) => {
            console.log('seguidor eliminado')
            res.redirect(`/page/${id}`);
        })
        .catch((e) => next(e));
}


module.exports.pages = (req, res, next) => {
    const id = { user: req.user._id }
    Profile.find(id)
        .then((p) => {
            let pagesUser = {
                userN: req.currentUser.userName,
                picture: req.currentUser.picture,
                pages: p
            }
            const idU = { followers: id.user }
            Profile.find(idU)
                .then((f) => {
                    console.log('paginas seguidas')
                    if (f[0]) {
                        console.log('hay paginaaaas')
                        pagesUser.pagesFollow = f;
                        res.render('users/pages', pagesUser);
                    } else {
                        console.log('no hay paginas')
                        res.render('users/pages', pagesUser)
                    }
                })
        })
        .catch((e) => next(e));
}

module.exports.page = (req, res, next) => {
    const idU = req.user._id
    const id = req.params.id
    if (idU == id) {
        res.redirect('/profile')
    } else {
        Profile.findById(id)
        .populate('body')
        .then((p) => {
            const idU = req.user._id
            const esta = p.followers.indexOf(idU)
            if (esta) {
                p.follow = true;
            } else {
                p.follow = false;
            }
            p.userN = req.currentUser.userName;
            p.picture = req.currentUser.picture
            res.render('users/profile', p);
        })
        .catch((e) => next(e));
    }
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
    let id = { user: req.user._id }
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
    let body = checkBox(req.body);
    console.log(body)
    const query = { _id: req.params.id, user: req.currentUser._id }
    Profile.findOne({ _id: req.params.id, user: req.currentUser._id })
        .then((profile) => {
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
                    if (containers[0]) {
                        console.log('Body encontrado ---------------');
                        let p = { containers }
                        p.userN = req.currentUser.userName;
                        p.picture = req.currentUser.picture;
                        p.selectBody = true;
                        res.render('users/editProfile', p);
                    } else {
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

module.exports.pagesCategory = (req, res, next) => {
    const category = categories.filter(category => { return category.index === req.params.index })

  
    Pages.find({ category: category[0].index })
        .populate('profile')
        .then((pages) => {

            let pagesCategory = {
                userN: req.currentUser.userName,
                picture: req.currentUser.picture,
                pages: pages,
                categoryFilter: category[0].description,
                
            }
            res.render('users/pagescategory', pagesCategory)

        })
        .catch((e) => next(e));
}



const checkBox = (body) => {
    if (body.comment === 'on') {
        body.comment = true;
    } else {
        body.comment = false;
    }
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

