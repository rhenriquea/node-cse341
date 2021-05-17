const router = require('express').Router();

const controller = require('../../controllers/shop');
const authenticated = require('../../middlewares/authenticated');

router.get('/', controller.getProducts);
router.get('/products/:id', controller.getProductDetails);

router.get('/cart', controller.getCart, authenticated);
router.get('/orders', controller.getOrders, authenticated);
router.post('/cart/:id', controller.addToCart, authenticated);
router.post('/cart/delete/:id', controller.deleteFromCart, authenticated);
router.post('/create-order', controller.postOrder, authenticated);

module.exports = router;
