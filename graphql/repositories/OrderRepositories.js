const { GraphQLError } = require('graphql');
const OrderModel = require('../../models/order');
const UserModel = require('../../models/user');

const getAllOrders = (req, shopId = '') => {
  if (!req.user) {
    return null;
  } else if (req.user.role === 'user') {
    return OrderModel.find({ user: req.user.id });
  } else {
    return shopId.length === 0
      ? OrderModel.find()
      : OrderModel.find({ shop: shopId });
  }
};
const createOrder = async (req) => {
  const { shop, items, amount, razorpayobj, user: id } = req.body.variables;

  const user = await UserModel.findById(id);
  const order = await OrderModel.create({
    shop,
    items,
    user: id,
    amount,
    razorpayobj,
  });
  if (!order.verifyPayment(user.active_order_id)) {
    await order.delete();
    throw new GraphQLError('Error Processing Payment');
  }

  if (!order) {
    throw new GraphQLError('Error While Creating Order');
  }
  user.active_order_id = '';
  return order;
};

module.exports = {
  getAllOrders,
  createOrder,
};
