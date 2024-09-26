const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const db = require('../db/queries');

const alphaErr = ' must only consist of letters.';
const lengthErr = ' must be between 1 and 15 characters long.';
const validateNewUser = [
    body('firstname').trim()
    .isAlpha().withMessage('First Name' + alphaErr)
    .isLength({min: 1, max: 15}).withMessage('First Name' + lengthErr),
    body('lastname').trim()
    .isAlpha().withMessage('Last Name' + alphaErr)
    .isLength({min: 1, max: 20}).withMessage('Last Name must be between 1 and 20 characters long.'),
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

const getHomePage = (req, res) => {
    res.render('index', { title: 'Home Page' })
}

const getSignUpPage = (req, res) => {
    res.render('signupForm', { title: 'Sign Up' });
}

const getLogInPage = asyncHandler( async (req, res) => {
    res.render('loginForm', { title: 'Log In' });
});

const postSignUpPage = [
    validateNewUser,
    asyncHandler(async (req, res)  => {
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const username = req.body.username;
        const password = req.body.password;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('signupForm', {
                title: 'Sign Up',
                errors: errors.array()
            });
        }
        await db.insertUser(firstName, lastName, username, password);
        res.redirect('/login');
    })
]

module.exports = { getHomePage, getSignUpPage, getLogInPage, postSignUpPage };