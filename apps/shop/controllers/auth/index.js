const { hash, compare } = require('bcryptjs');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const User = require("../../models/user");

exports.getLogin = async(req, res, next) => {
  res.render('pages/auth/login', {
      title: 'Login',
      path: '/shop/auth/login',
      error: req.flash('error'),
  });
};

exports.postLogin = async(req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user) {
    req.flash('error', 'Invalid credentials')
    return res.redirect('/shop/auth/login')
  };

  try {
    const validPassword = await compare(password, user.password);

    if(!validPassword) {
      req.flash('error', 'Invalid credentials')
      return res.redirect('/shop/auth/login');
    }

    req.session.isAuthenticated = true;
    req.session.user = user;
    req.session.save(err => {
      if(err) console.error(err);
      res.redirect('/shop');
    });

  } catch(e) {
    console.error(e);
    req.flash('error', 'Something went wrong, try again later')
    return res.redirect('/shop/auth/login');
  }
};

exports.getSignup = async(req, res, next) => {  
  res.render('pages/auth/signup', {
      title: 'Signup',
      path: '/shop/auth/signup',
      error: req.flash('error'),
  });
};

exports.postSignup = async(req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({ email });
  
  if(user) {
    req.flash('error', 'Email already registered')
    return res.redirect('/shop/auth/signup');
  }

  let securePassword = await hash(password, 12);

  const newUser = new User({ email, password: securePassword, cart: {items: []}});
  await newUser.save();

  try {
    await sgMail.send( {
      to: email,
      from: 'shop@cse341.com',
      subject: 'Thanks for your signup!',
      html: '<strong>You can now continue exploring the application!</strong>',
    })
    res.redirect('/shop/auth/login');
  } catch(error) {
    console.error(error)
  }
  
};

exports.getReset = async(req, res, next) => {
  res.render('pages/auth/reset', {
      title: 'Reset Password',
      path: '/shop/auth/reset',
      error: req.flash('error'),
  });
};

exports.postLogout = async(req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/shop');
  });
};