const { body } = require('express-validator');

const alphaErr = ' must only consist of letters.';
const alphaNumErr1 = ' must only consist of letters and numbers.';
const alphaNumErr2 = ' must only consist of letters, numbers, spaces, and hyphens.';
const lengthErr = ' must be between 1 and 15 characters long.';

const validateUserInfo = [
    body('firstname').trim()
    .isAlpha().withMessage('First Name' + alphaErr)
    .isLength({min: 1, max: 15}).withMessage('First Name' + lengthErr),
    body('lastname').trim()
    .isAlpha().withMessage('Last Name' + alphaErr)
    .isLength({min: 1, max: 25}).withMessage('Last Name must be between 1 and 25 characters long.'),
    body('username').trim()
    .isAlphanumeric('en-US', { ignore: '[\s-]' }).withMessage('Username' + alphaNumErr2)
    .isLength({min: 1, max: 15}).withMessage('Username' + lengthErr),
    body('password').trim()
    .isAlphanumeric().withMessage('Password' + alphaNumErr1)
    .isLength({min: 1, max: 15}).withMessage('Password' + lengthErr),
    body('confirm').trim()
    .custom((value, {req}) => {
        return value === req.body.password
    }).withMessage('Confirm Password field must match password.')
];

const validateLogIn = [
    validateUserInfo[2],
    validateUserInfo[3]
];

const validateMemberSecret = [
    body('memberSecret').trim()
    .isAlphanumeric().withMessage('Member Secret' + alphaNumErr1)
    .notEmpty().withMessage('Member Secret cannot be empty.')
    .custom((value) => {
        return value === process.env.MEMBER_SECRET;
    }).withMessage('Incorrect Member Secret.')
];

const validateAdminSecret = [
    body('adminSecret').trim()
    .isAlphanumeric().withMessage('Admin Secret' + alphaNumErr1)
    .notEmpty().withMessage('Admin Secret cannot be emtpy.')
    .custom((value) => {
        return value === process.env.ADMIN_SECRET;
    }).withMessage('Incorrect Admin Secret.')
];

const validateMessage = [
    body('title').trim()
    .isAscii().withMessage('Title must consist of only Ascii characters.')
    .isLength({min: 1, max: 20}).withMessage('Title must be between 1 and 20 characters long.'),
    body('text').trim()
    .isAscii().withMessage('Message must consist of only Ascii characters.')
    .isLength({min: 1, max: 250}).withMessage('Message must be between 1 and 250 characters long.')
];

module.exports = { validateUserInfo, validateLogIn, validateMemberSecret, validateAdminSecret, validateMessage };