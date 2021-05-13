const router = require('express').Router();

const { 
  getAddProduct, 
  getAdminProducts, 
  getEditProduct, 
  getDeleteProduct,
  postAddProduct, 
  postEditProduct, 
  postDeleteProduct, 
} = require('../../controllers/admin');

router.get('/products', getAdminProducts);
router.get('/add-product', getAddProduct);
router.get('/edit/:id', getEditProduct);
router.get('/delete/:id', getDeleteProduct);

router.post('/add-product', postAddProduct);
router.post('/edit-product', postEditProduct);
router.post('/delete-product', postDeleteProduct);

module.exports = router;