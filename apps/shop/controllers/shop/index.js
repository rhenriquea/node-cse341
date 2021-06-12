const Product = require('../../models/product');
const Order = require('../../models/order');

const ITEMS_PER_PAGE = 2;

exports.getProducts = async (req, res) => {
  let { page } = req.query;
  page = +page || 1;

  const productsCount = await Product.find().countDocuments();

  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const hasNextPage = ITEMS_PER_PAGE * page < productsCount;
  const hasPreviousPage = page > 1;
  const nextPage = page + 1;
  const previousPage = page - 1;
  const lastPage = Math.ceil(productsCount / ITEMS_PER_PAGE);

  res.render('pages/shop', {
    title: 'Shop',
    path: '/shop',
    cartCount: (req.user && req.user.getCartProductsAmount()) || 0,
    products,
    productsCount,
    currentPage: page,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    lastPage,
  });
};

exports.getProductDetails = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  res.render('pages/shop/product-details', {
    title: 'Product Details',
    path: '/products',
    cartCount: (req.user && req.user.getCartProductsAmount()) || 0,
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
    cartCount: (req.user && req.user.getCartProductsAmount()) || 0,
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
    cartCount: (req.user && req.user.getCartProductsAmount()) || 0,
    orders,
  });
};
