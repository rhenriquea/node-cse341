const Product = require('../../models/product');
const Order = require('../../models/Order');

exports.getProducts = async(req, res, next) => {
    const products = await Product.find();

    res.render('pages/shop', {
        title: 'Shop',
        path: '/shop',
        products,
        cartCount: req.user.getCartProductsAmount()
    });
};

exports.getProductDetails = async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

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
    const user = await req.user
        .populate('cart.items.productData')
        .execPopulate()

    const products = user.cart.items.map(({ productData, quantity }) => {
        const { _id, title, price, description, imageUrl } = productData;
        return {
            _id,
            title,
            description,
            imageUrl,
            quantity,
            total: (quantity * price).toFixed(2)
        }
    });

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

exports.postOrder = async(req, res, next) => {
     
    const user = await req.user
        .populate('cart.items.productData')
        .execPopulate()
  
    const { username, _id } = user;

    const products = user.cart.items.map(({quantity, productData}) => {
        return { quantity, product: { ...productData._doc } };
    });

    const order = new Order({ user: { username, userId: _id }, products });

    await order.save();

    await req.user.clearCart();
    
    res.redirect('/shop/orders');
};

exports.getOrders = async(req, res, next) => {
    const orders = await Order.find({'user.userId': req.user._id});
    
    res.render('pages/shop/orders', {
        title: 'Orders',
        path: '/shop/orders',
        products,
        cartCount: req.user.getCartProductsAmount(),
        orders
    });
};