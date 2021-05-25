module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/shop/auth/login');
  }
  next();
};
