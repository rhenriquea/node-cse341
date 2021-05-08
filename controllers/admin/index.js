const Product = require('../../models/product');

exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render('pages/shop/admin/products', {
      title: 'Add Product',
      path: '/shop/admin/products',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true,
      products
  });
};

exports.postAddProduct = async (req, res, next) => {
  const {title, imageUrl, price, description} = req.body;
  const product = new Product(title, price, description, imageUrl);
  await product.save();
  res.redirect('/');
};

exports.getAddProduct = (req, res, next) => {
  res.render('pages/shop/add-product', {
      title: 'Add Product',
      path: '/shop/admin/add-product',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true
  });
};


exports.getEditProduct = (req, res, next) => {
  const { id } = req.params;
  const product = Product.findById(id);
  
};

exports.postEditProduct = (req, res, next) => {
  res.render('pages/shop/add-product', {
      title: 'Add Product',
      path: '/shop/admin/add-product',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true
  });
};