const express = require('express');
const {
  getAllShops,
  createShop,
  shopImageUpload,
} = require('../controllers/shopController');
const productsRouter = require('../routes/products');
const ordersRouter = require('../routes/orders');

const router = express.Router();

router.route('/').get(getAllShops).post(shopImageUpload, createShop);
router.use('/:shopId/products', productsRouter);
router.use('/:shopId/orders', ordersRouter);

module.exports = router;
