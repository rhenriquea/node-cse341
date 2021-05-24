const router = require('express').Router();

const controller = require('../../controllers/shop');
const authenticated = require('../../middlewares/authenticated');

router.get('/', controller.getProducts);
router.get('/products/:id', controller.getProductDetails);

router.get('/cart', authenticated, controller.getCart);
router.get('/orders', authenticated, controller.getOrders);
router.post('/cart/:id', authenticated, controller.addToCart);
router.post('/cart/delete/:id', authenticated, controller.deleteFromCart);
router.post('/create-order', authenticated, controller.postOrder);

module.exports = router;
