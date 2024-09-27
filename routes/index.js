const { Router } = require('express');
const passport = require('passport');
const controller = require('../controllers/controller');
const auth = require('./authMiddleware');

const router = Router();

router.get('/', controller.getHomePage);
router.get('/signup', controller.getSignUpPage);
router.get('/login', controller.getLogInPage);
router.get('/logout', controller.logoutUser);
router.get('/profile', auth.isAuth, controller.getProfilePage);
router.get('/newMessage', );
router.get('/memberSecret', );
router.get('/adminSecret', )
router.post('/signup', controller.postSignUp);
router.post('/login', controller.postLogIn);
router.post('/newMessage',);
router.post('/memberSecret',);
router.post('/adminSecret',);

module.exports = router;
