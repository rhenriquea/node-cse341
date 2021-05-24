const router = require('express').Router();

const { body } = require('express-validator');
const controller = require('../../controllers/admin');

router.get('/products', controller.getAdminProducts);
router.get('/add-product', controller.getAddProduct);
router.get('/edit/:id', controller.getEditProduct);
router.get('/delete/:id', controller.getDeleteProduct);

router.post(
  '/add-product',
  [
    body('title').isLength({ min: 3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 8, max: 250 }).trim(),
  ],
  controller.postAddProduct
);
router.post(
  '/edit-product',
  [
    body('title').isLength({ min: 3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 8, max: 250 }).trim(),
  ],
  controller.postEditProduct
);
router.post('/delete-product', controller.postDeleteProduct);

module.exports = router;
