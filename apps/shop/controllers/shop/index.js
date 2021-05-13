const Product = require('../../models/product');

exports.getProducts = async(req, res, next) => {
    const products = await Product.fetchAll();

    res.render('pages/shop', {
        title: 'Shop',
        path: '/shop',
        products,
        cartCount: req.user.getCartProductsAmount()
    });
};

exports.getProductDetails = async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.find(id);

    res.render('pages/shop/product-details', {
        title: 'Product Details',
        path: '/products',
        product,
        cartCount: req.user.getCartProductsAmount()
    });
};

exports.addToCart = async(req, res, next) => {
    const { id } = req.params;
    await req.user.addToCart(id);
    res.redirect('/shop');
};

exports.getCart = async(req, res, next) => {
    const products = await req.user.getCart();
    const cartTotal = products.reduce((acc, product) => {
      return acc + +product.total
    }, 0).toFixed(2);

    res.render('pages/shop/cart', {
        title: 'Cart',
        path: '/shop/cart',
        products,
        cartCount: req.user.getCartProductsAmount(),
        cartTotal,
    });
};

exports.deleteFromCart = async(req, res, next) => {
   await req.user.removeFromCart(req.params.id);
   res.redirect('/shop/cart');
};