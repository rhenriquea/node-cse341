const { validationResult } = require('express-validator');
const Product = require('../../models/product');

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id }).populate(
      'userId'
    );
    res.render('pages/admin/products', {
      title: 'Admin Products',
      path: '/shop/admin/products',
      products,
    });
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.getAddProduct = (req, res) => {
  res.render('pages/admin/add-product', {
    title: 'Add Product',
    path: '/shop/admin/add-product',
    error: undefined,
    validatiorErrors: [],
    product: {
      title: '',
      imageUrl: '',
      price: '',
      description: '',
    },
  });
};

exports.getEditProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) return res.redirect('/shop');

    res.render('pages/admin/edit-product', {
      title: 'Edit -',
      path: '/shop/admin/edit-product',
      error: undefined,
      validatiorErrors: [],
      product,
    });
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.getDeleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) return res.redirect('/shop');

    res.render('pages/admin/delete-product', {
      title: 'Delete',
      path: '/shop/admin/delete-product',
      product,
    });
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const userId = req.user._id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('pages/admin/add-product', {
      title: 'Add Product',
      path: '/shop/admin/add-product',
      error: errors.array().map((e) => e.msg),
      validatiorErrors: errors.array(),
      product: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId,
  });

  try {
    await product.save();
    res.redirect('/shop/admin/products');
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('pages/admin/edit-product', {
      title: 'Edit -',
      path: '/shop/admin/edit-product',
      error: errors.array().map((e) => e.msg),
      validatiorErrors: errors.array(),
      product: {
        _id: productId,
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  const product = await Product.findById(productId);

  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/shop');
  }

  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;

  try {
    await product.save();
    res.redirect('/shop/admin/products');
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  try {
    await req.user.removeFromCart(productId);
    await Product.deleteOne({ _id: productId, userId: req.user._id });
    res.redirect('/shop/admin/products');
  } catch (e) {
    const err = new Error(e);
    err.httpStatusCode = 500;
    return next(err);
  }
};
