const Product = require('../../models/product');

exports.getAdminProducts = async(req, res, next) => {
    const products = await Product.fetchAll();

    res.render('pages/admin/products', {
        title: 'Add Product',
        path: '/shop/admin/products',
        products,
        cartCount: req.user.getCartProductsAmount()
    });
};

exports.getAddProduct = (req, res, next) => {
    res.render('pages/admin/add-product', {
        title: 'Add Product',
        path: '/shop/admin/add-product',
        cartCount: req.user.getCartProductsAmount()
    });
};

exports.getEditProduct = async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.find(id);

    res.render('pages/admin/edit-product', {
        title: 'Edit -',
        path: '/shop/admin/edit-product',
        cartCount: req.user.getCartProductsAmount(),
        product
    });
};

exports.getDeleteProduct = async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.find(id);

    res.render('pages/admin/delete-product', {
        title: 'Delete',
        path: '/shop/admin/delete-product',
        cartCount: req.user.getCartProductsAmount(),
        product
    });
};

exports.postAddProduct = async(req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl, req.user._id);
  await product.save();
  res.redirect('/shop/admin/products');
};

exports.postEditProduct = async(req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;
    const product = new Product(title, price, description, imageUrl, req.user._id);
    await Product.updateById(productId, product);
    res.redirect('/shop/admin/products');
};

exports.postDeleteProduct = async(req, res, next) => {
    const { productId } = req.body;
    await req.user.removeFromCart(productId);
    await Product.deleteById(productId);
    res.redirect('/shop/admin/products');
};