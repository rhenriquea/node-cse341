const router = require('express').Router();

const controller = require('../../controllers/auth');

router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/reset', controller.getReset);
router.get('/reset/:token', controller.getNewPassword);

router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/signup', controller.postSignup);
router.post('/reset', controller.postResetPassword);
router.post('/new-password', controller.postNewPassword);

module.exports = router;
