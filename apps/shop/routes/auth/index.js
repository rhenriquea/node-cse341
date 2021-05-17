const router = require('express').Router();

const controller = require('../../controllers/auth');

router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/reset', controller.getReset);

router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/signup', controller.postSignup);

module.exports = router;
