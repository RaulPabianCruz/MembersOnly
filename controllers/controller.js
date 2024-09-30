const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validator = require('./validate');
const db = require('../db/queries');

const getHomePage = asyncHandler(async (req, res) => {
    const messages = await db.getAllMessages();
    res.render('index', { 
        title: 'Home Page',
        messages: messages
    })
});

const getSignUpPage = (req, res) => {
    res.render('signupForm', { title: 'Sign Up' });
}

const getLogInPage = (req, res) => {
    res.render('loginForm', { title: 'Log In' });
}

const getProfilePage = (req, res) => {
    res.render('profile', { title: 'Profile Page'});
}

const getMemberSecretPage = (req, res) => {
    res.render('secretPage', {
        title: 'Member Registration',
        route: 'memberSecret',
    });
}

const getAdminSecretPage = (req, res) => {
    res.render('secretPage', {
        title: 'Admin Registration',
        route: 'adminSecret'
    });
}

const getNewMessagePage = (req, res) => {
    res.render('newMessageForm', {
        title: 'New Message'
    });
}

const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err)
            return next(err);
        res.redirect('/');
    });
}

const postSignUp = [
    validator.validateUserInfo,
    asyncHandler(async (req, res)  => {
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const username = req.body.username;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('signupForm', {
                title: 'Sign Up',
                errors: errors.array()
            });
        }

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err)
                return res.status(400);
            await db.insertUser(firstName, lastName, username, hashedPassword);
            res.redirect('/login');
        });
    })
];

const postLogIn = [
    validator.validateLogIn,
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('loginForm', {
                title: 'Log In',
                errors: errors.array()
            });
        }
        next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if(err)
                return next(err);
            if(!user)
                return res.status(400).render('loginForm', {
                   title: 'Log In',
                   errors: [{ msg: info.message }] 
                });

            req.login(user, (err) => {
                if(err)
                    return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    }
];

const postMemberSecret = [
    validator.validateMemberSecret,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('secretPage', {
                title: 'Member Registration',
                route: 'memberSecret',
                errors: errors.array()
            });
        }
        await db.grantMemberStatus(req.user.id);
        res.redirect('/profile');
    })
];

const postAdminSecret = [
    validator.validateAdminSecret,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('secretPage', {
                title: 'Admin Registration',
                route: 'adminSecret',
                errors: errors.array()
            });
        }
        await db.grantAdminStatus(req.user.id);
        res.redirect('/profile');
    })
];

const postMessage = [
    validator.validateMessage,
    asyncHandler(async (req, res) => {
        const title = req.body.title;
        const text = req.body.text;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('newMessageForm', {
                title: 'New Message',
                errors: errors.array()
            });
        }
        await db.insertUserMessage(req.user.id, title, text);
        res.redirect('/');
    })
];

const deleteMessage = asyncHandler(async (req, res) => {
    const messageId = Number(req.params.messageId);

    if(typeof messageId != 'number') {
        res.status(401).redirect('/');
    }

    await db.deleteMessage(messageId);
    res.redirect('/')
});

module.exports = { 
    getHomePage, 
    getSignUpPage, 
    getLogInPage, 
    getProfilePage,
    getMemberSecretPage,
    getAdminSecretPage,
    getNewMessagePage,
    logoutUser, 
    postSignUp, 
    postLogIn,
    postMemberSecret,
    postAdminSecret,
    postMessage,
    deleteMessage
};