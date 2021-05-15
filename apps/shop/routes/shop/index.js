const router = require('express').Router();

const { 
  getProducts, 
  getProductDetails, 
  addToCart, 
  getCart, 
  deleteFromCart,
  postOrder

} = require('../../controllers/shop');

router.get('/', getProducts)
router.get('/products/:id', getProductDetails)
router.get('/cart', getCart)
//router.get('/orders', deleteFromCart)

router.post('/cart/:id', addToCart)
router.post('/cart/delete/:id', deleteFromCart)
router.post('/create-order', postOrder)

module.exports = router;