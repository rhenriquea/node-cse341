const router = require('express').Router();

const { getAddProduct, postAddProduct, getAdminProducts } = require('../../../controllers/admin');

router.get('/products', getAdminProducts);
router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);

module.exports = router;