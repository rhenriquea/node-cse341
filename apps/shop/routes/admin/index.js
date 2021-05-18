const router = require('express').Router();

const controller = require('../../controllers/admin');

router.get('/products', controller.getAdminProducts);
router.get('/add-product', controller.getAddProduct);
router.get('/edit/:id', controller.getEditProduct);
router.get('/delete/:id', controller.getDeleteProduct);

router.post('/add-product', controller.postAddProduct);
router.post('/edit-product', controller.postEditProduct);
router.post('/delete-product', controller.postDeleteProduct);

module.exports = router;
