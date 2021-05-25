const router = require('express').Router();
const { body } = require('express-validator');

const controller = require('../../controllers/auth');

router.get('/login', controller.getLogin);
router.get('/signup', controller.getSignup);
router.get('/reset', controller.getReset);
router.get('/reset/:token', controller.getNewPassword);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      'password',
      'Please enter a password with only numbers, text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  controller.postLogin
);
router.post('/logout', controller.postLogout);
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      'password',
      'Please enter a password with only numbers, text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords are not equal. Make sure they match');
        }
        return true;
      }),
  ],
  controller.postSignup
);
router.post(
  '/reset',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail({ gmail_remove_dots: false }),
  ],
  controller.postResetPassword
);
router.post(
  '/new-password',
  [
    body(
      'password',
      'Please enter a password with only numbers, text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords are not equal. Make sure they match');
        }
        return true;
      }),
  ],
  controller.postNewPassword
);

module.exports = router;
