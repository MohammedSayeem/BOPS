const mongoose = require('mongoose');
const { createHmac } = require('crypto');

const OrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'created',
      enum: ['created', 'processing', 'ready', 'completed'],
    },
    items: {
      required: true,
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
          },
          quantity: Number,
        },
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    razorpayobj: {
      type: {
        razorpay_payment_id: String,
        razorpay_order_id: String,
        razorpay_signature: String,
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

OrderSchema.methods.setOrderStatus = function (status) {
  this.status = status;
};
OrderSchema.methods.verifyPayment = function (order_id) {
  const generatedHash = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + '|' + this.razorpayobj.razorpay_payment_id)
    .digest('hex');
  return generatedHash === this.razorpayobj.razorpay_signature;
};

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
