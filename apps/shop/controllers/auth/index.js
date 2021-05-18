const { randomBytes } = require('crypto');

const { hash, compare } = require('bcryptjs');

const User = require('../../models/user');

exports.getLogin = async (req, res) => {
  res.render('pages/auth/login', {
    title: 'Login',
    path: '/shop/auth/login',
    error: req.flash('error'),
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

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
    success: false,
  });
};

exports.postSignup = async (req, res) => {
  const { email, password } = req.body;

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

  await newUser.save();

  res.render('pages/auth/signup', {
    title: 'Signup',
    path: '/shop/auth/signup',
    error: [],
    success: true,
  });
};

exports.getReset = async (req, res) => {
  res.render('pages/auth/reset', {
    title: 'Reset Password',
    path: '/shop/auth/reset',
    error: req.flash('error'),
  });
};

exports.postResetPassword = async (req, res) => {
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
    user.resetTokenExpiration = new Date() + 3600000;
    user.save();

    res.redirect('/shop');

    /*     await sgMail.send({
      to: email,
      from: 'shop@cse341.com',
      subject: 'Password reset',
      html: `
       <p> You have requested a password reset </p>
       <p> Click the link below to reset your password </p>
       <a href="http://localhost:3000/shop/auth/reset/${token}">Reset password</a>
      `,
    }); */
  });
};

exports.getNewPassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
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
  });
};

exports.postNewPassword = async (req, res) => {
  const { password, userId, passwordToken } = req.body;

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