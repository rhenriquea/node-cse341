const Product = require('../../models/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render('pages/shop', {
      title: 'Shop',
      path: '/shop',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true,
      products
  });
};

exports.getProductDetails = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  console.log(product);

  res.render('pages/shop/product-details', {
      title: 'Product Details',
      path: '/products',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true,
      product
  });
};