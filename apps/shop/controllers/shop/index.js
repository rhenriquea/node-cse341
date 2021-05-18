const Product = require('../../models/product');
const Order = require('../../models/order');

exports.getProducts = async (req, res) => {
  const products = await Product.find();

  res.render('pages/shop', {
    title: 'Shop',
    path: '/shop',
    products,
  });
};

exports.getProductDetails = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  res.render('pages/shop/product-details', {
    title: 'Product Details',
    path: '/products',
    product,
  });
};

exports.addToCart = async (req, res) => {
  const { id } = req.params;
  await req.user.addToCart(id);
  res.redirect('/shop');
};

exports.getCart = async (req, res) => {
  const user = await req.user.populate('cart.items.productData').execPopulate();

  const products = user.cart.items.map(({ productData, quantity }) => {
    const { _id, title, price, description, imageUrl } = productData;
    return {
      _id,
      title,
      description,
      imageUrl,
      quantity,
      total: (quantity * price).toFixed(2),
    };
  });

  const cartTotal = products
    .reduce((acc, product) => acc + +product.total, 0)
    .toFixed(2);

  res.render('pages/shop/cart', {
    title: 'Cart',
    path: '/shop/cart',
    products,
    cartTotal,
  });
};

exports.deleteFromCart = async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  res.redirect('/shop/cart');
};

exports.postOrder = async (req, res) => {
  const user = await req.user.populate('cart.items.productData').execPopulate();

  const { email, _id } = user;

  const products = user.cart.items.map(({ quantity, productData }) => ({
    quantity,
    product: { ...productData._doc },
  }));

  const order = new Order({ user: { email, userId: _id }, products });

  await order.save();

  await req.user.clearCart();

  res.redirect('/shop/orders');
};

exports.getOrders = async (req, res) => {
  if (!req.user) return res.send({ status: 401, message: 'Unauthorized' });

  const orders = await Order.find({ 'user.userId': req.user._id });

  res.render('pages/shop/orders', {
    title: 'Orders',
    path: '/shop/orders',
    orders,
  });
};
