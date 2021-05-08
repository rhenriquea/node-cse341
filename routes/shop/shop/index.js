const router = require('express').Router();

const { getProducts, getProductDetails } = require('../../../controllers/shop');

router.get('/', getProducts)
router.get('/products/:id', getProductDetails)

module.exports = router;