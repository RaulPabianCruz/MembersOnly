const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');

const getHomePage = (req, res) => {
    console.log(req.session);
    res.render('index', { title: 'Home Page' })
}

const getSignUpPage = (req, res) => {
    console.log(req.session);
    res.render('signupForm', { title: 'Sign Up' });
}

module.exports = { getHomePage, getSignUpPage };