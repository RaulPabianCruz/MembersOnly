const { Router } = require('express');
const passport = require('passport');
const controller = require('../controllers/controller');

const router = Router();

router.get('', controller.getHomePage);
router.get('/signup', controller.getSignUpPage);
router.get('/login', controller.getLogInPage);
router.get('/newMessage',);
router.get('/memberSecret',);
router.get('/adminSecret',)
router.post('/signup', controller.postSignUpPage);
router.post('/login',);
router.post('/newMessage',);
router.post('/memberSecret',);
router.post('/adminSecret',);

module.exports = router;
