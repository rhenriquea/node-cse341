const { randomBytes } = require('crypto');
const { hash, compare } = require('bcryptjs');
const { validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../../models/user');

exports.getLogin = async (req, res) => {
  res.render('pages/auth/login', {
    title: 'Login',
    path: '/shop/auth/login',
    error: req.flash('error'),
    validationErrors: [],
    oldInput: { email: '', password: '' },
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/login', {
      title: 'Login',
      path: '/shop/auth/login',
      error: errors.array().map((e) => e.msg),
      validationErrors: errors.array(),
      oldInput: { email, password },
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/shop/auth/login');
  }

  try {
    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/shop/auth/login');
    }

    req.session.isAuthenticated = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) console.error(err);
      res.redirect('/shop');
    });
  } catch (e) {
    console.error(e);
    req.flash('error', 'Something went wrong, try again later');
    return res.redirect('/shop/auth/login');
  }
};

exports.getSignup = async (req, res) => {
  res.render('pages/auth/signup', {
    title: 'Signup',
    path: '/shop/auth/signup',
    error: req.flash('error'),
    validationErrors: [],
    oldInput: { email: '', password: '', confirmPassword: '' },
    success: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/signup', {
      title: 'Signup',
      path: '/shop/auth/signup',
      error: errors.array().map((e) => e.msg),
      validationErrors: errors.array(),
      success: false,
      oldInput: { email, password, confirmPassword },
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    req.flash('error', 'Email already registered');
    return res.redirect('/shop/auth/signup');
  }

  const securePassword = await hash(password, 12);

  const newUser = new User({
    email,
    password: securePassword,
    cart: { items: [] },
  });

  try {
    await newUser.save();

    res.render('pages/auth/signup', {
      title: 'Signup',
      path: '/shop/auth/signup',
      error: [],
      validationErrors: [],
      success: true,
      oldInput: { email, password, confirmPassword },
    });
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.getReset = async (req, res) => {
  res.render('pages/auth/reset', {
    title: 'Reset Password',
    path: '/shop/auth/reset',
    success: [],
    error: req.flash('error'),
  });
};

exports.postResetPassword = async (req, res, next) => {
  const { email } = req.body;
  randomBytes(32, async (err, buffer) => {
    if (err) return res.redirect('/shop/auth/reset');

    const token = buffer.toString('hex');
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User not registered or not found');
      return res.redirect('/shop/auth/reset');
    }

    user.resetToken = token;

    // Current date + 1 hour
    const date = new Date();
    user.resetTokenExpiration = date.setHours(date.getHours() + 1);

    try {
      await user.save();
    } catch (e) {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    }

    try {
      await sgMail.send({
        to: email,
        from: `${process.env.SENDER_EMAIL}`,
        subject: 'Password reset',
        html: `
         <p> You have requested a password reset </p>
         <p> Click the link below to reset your password </p>
         <p>If the link doesn't work, copy and paste on your browser</p>
         <a href="${process.env.DOMAIN}/shop/auth/reset/${token}">
          ${process.env.DOMAIN}/shop/auth/reset/${token}
         </a>
        `,
      });

      req.flash(
        'success',
        'Check your email to get the reset link. You may check your SPAM box in case you do not find in your inbox'
      );

      res.render('pages/auth/reset', {
        title: 'Reset Password',
        path: '/shop/auth/reset',
        error: [],
        success: req.flash('success'),
      });
    } catch (e) {
      console.log(e.response.body);
    }
  });
};

exports.getNewPassword = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gte: new Date() },
  });

  if (!user) {
    req.flash('error', 'Something went wrong');
  }

  res.render('pages/auth/new-password', {
    title: 'New Password',
    path: '/shop/auth/new-password',
    error: req.flash('error'),
    userId: user._id.toString(),
    passwordToken: token,
    validationErrors: [],
    oldInput: { password: '', confirmPassword: '' },
  });
};

exports.postNewPassword = async (req, res) => {
  const { password, confirmPassword, userId, passwordToken } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/new-password', {
      title: 'New Password',
      path: '/shop/auth/new-password',
      userId,
      passwordToken,
      error: errors.array().map((e) => e.msg),
      validationErrors: errors.array(),
      oldInput: { password, confirmPassword },
    });
  }

  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  const newPassword = await hash(password, 12);

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();

  res.redirect('/shop/auth/login');
};

exports.postLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/shop');
  });
};
