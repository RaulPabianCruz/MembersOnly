const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('', controller.getHomePage);
router.get('/signup', controller.getSignUpPage);
router.get('/login',);
router.get('/newMessage',);
router.get('/memberSecret',);
router.get('/adminSecret',)
router.post('/signup',);
router.post('/login',);
router.post('/newMessage',);
router.post('/memberSecret',);
router.post('/adminSecret',);

module.exports = router;
