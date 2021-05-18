const Product = require('../../models/product');

exports.getAdminProducts = async (req, res) => {
  const products = await Product.find({ userId: req.user._id }).populate(
    'userId'
  );

  res.render('pages/admin/products', {
    title: 'Add Product',
    path: '/shop/admin/products',
    products,
  });
};

exports.getAddProduct = (req, res) => {
  res.render('pages/admin/add-product', {
    title: 'Add Product',
    path: '/shop/admin/add-product',
  });
};

exports.getEditProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) return res.redirect('/shop');

  res.render('pages/admin/edit-product', {
    title: 'Edit -',
    path: '/shop/admin/edit-product',
    product,
  });
};

exports.getDeleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) return res.redirect('/shop');

  res.render('pages/admin/delete-product', {
    title: 'Delete',
    path: '/shop/admin/delete-product',
    product,
  });
};

exports.postAddProduct = async (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const userId = req.user._id;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId,
  });

  await product.save();

  res.redirect('/shop/admin/products');
};

exports.postEditProduct = async (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const product = await Product.findById(productId);

  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/shop');
  }

  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;

  await product.save();

  res.redirect('/shop/admin/products');
};

exports.postDeleteProduct = async (req, res) => {
  const { productId } = req.body;
  await req.user.removeFromCart(productId);
  await Product.deleteOne({ _id: productId, userId: req.user._id });
  res.redirect('/shop/admin/products');
};
