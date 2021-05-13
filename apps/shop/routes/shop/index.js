const router = require('express').Router();

const { 
  getProducts, 
  getProductDetails, 
  addToCart, 
  getCart, 
  deleteFromCart 
} = require('../../controllers/shop');

router.get('/', getProducts)
router.get('/products/:id', getProductDetails)
router.get('/cart', getCart)
router.post('/cart/:id', addToCart)
router.post('/cart/delete/:id', deleteFromCart)

module.exports = router;