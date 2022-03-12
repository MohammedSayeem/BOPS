const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterObj = require('../utils/filterObj');
const User = require('../models/user');

const createOrder = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'shop',
    'user',
    'items',
    'amount',
    'razorpayobj'
  );
  const user = await User.findById(filteredBody.user);
  const order = await Order.create(filteredBody);
  if (!order.verifyPayment(user.active_order_id)) {
    await order.delete();
    return next(new AppError(401, 'Error Processing Payment'));
  }

  if (!order) {
    return next(new AppError(400, 'Please fill all the fields'));
  }
  user.active_order_id = '';
  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});
const getAllOrders = catchAsync(async (req, res, next) => {
  let orders;
  if (req.params.shopId) {
    orders = await Order.find({ shop: req.params.shopId });
  } else if (req.params.userId) {
    orders = await Order.find({ user: req.params.userId });
  } else {
    orders = await Order.find();
  }
  res.json({
    status: 'success',
    data: {
      orders,
    },
  });
});

module.exports = {
  createOrder,
  getAllOrders,
};
