const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');

const alphaErr = ' must only consist of letters.';
const lengthErr = ' must be between 1 and 15 characters long.';
const validateUserInfo = [
    body('firstname').trim()
    .isAlpha().withMessage('First Name' + alphaErr)
    .isLength({min: 1, max: 15}).withMessage('First Name' + lengthErr),
    body('lastname').trim()
    .isAlpha().withMessage('Last Name' + alphaErr)
    .isLength({min: 1, max: 25}).withMessage('Last Name must be between 1 and 25 characters long.'),
    body('username').trim()
    .isAlphanumeric('en-US', { ignore: '[\s-]' }).withMessage('Username must only consist of numbers, letters, spaces, and hyphens.')
    .isLength({min: 1, max: 15}).withMessage('Username' + lengthErr),
    body('password').trim()
    .isAlphanumeric().withMessage('Password must only consist of letters and numbers')
    .isLength({min: 1, max: 15}).withMessage('Password' + lengthErr),
    body('confirm').trim()
    .custom((value, {req}) => {
        return value === req.body.password
    }).withMessage('Confirm Password field must match password.')
];
const validateSecrets = [
    body('memberSecret').trim()
    .isAlphanumeric().withMessage('Member Secret can only consist of letters and numbers.')
    .notEmpty().withMessage('Member Secret cannot be empty.')
    .custom((value) => {
        return value === process.env.MEMBER_SECRET;
    }).withMessage('Incorrect Member Secret.'),
    body('adminSecret').trim()
    .isAlphanumeric().withMessage('Admin Secret can only consist of letters and numbers.')
    .notEmpty().withMessage('Admin Secret cannot be emtpy.')
    .custom((value) => {
        return value === process.env.ADMIN_SECRET;
    }).withMessage('Incorrect Admin Secret.')
];

const getHomePage = (req, res) => {
    res.render('index', { title: 'Home Page' })
}

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

const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err)
            return next(err);
        res.redirect('/');
    });
}

const postSignUp = [
    validateUserInfo,
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
    validateUserInfo[2],
    validateUserInfo[3],
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
    validateSecrets[0],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('secretPage', {
                title: 'Member Registration',
                route: 'memberSecret',
                errors: errors.array()
            });
        }
        await db.updateMemberStatus(req.user.id, true);
        res.redirect('/profile');
    })
]

module.exports = { 
    getHomePage, 
    getSignUpPage, 
    getLogInPage, 
    getProfilePage,
    getMemberSecretPage,
    getAdminSecretPage,
    logoutUser, 
    postSignUp, 
    postLogIn,
    postMemberSecret,
};