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
router.get('/newMessage', auth.isAuth, controller.getNewMessagePage);
router.get('/memberSecret', auth.isAuth, controller.getMemberSecretPage);
router.get('/adminSecret', auth.isAuth, controller.getAdminSecretPage)
router.post('/signup', controller.postSignUp);
router.post('/login', controller.postLogIn);
router.post('/newMessage', auth.isAuth, controller.postMessage);
router.post('/memberSecret', auth.isAuth, controller.postMemberSecret);
router.post('/adminSecret', auth.isAuth, controller.postAdminSecret);
router.post('/deleteMessage/:messageId', auth.isAdmin, controller.deleteMessage);

module.exports = router;
