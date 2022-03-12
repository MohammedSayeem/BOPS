const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A shop should have a name'],
  },
  image: {
    type: String,
  },
  avgRating: {
    type: Number,
    default: 3,
  },
  ratings: {
    type: [Number],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'A Shop must have an owner'],
    unique: [
      true,
      'If you Already have a shop registered, Please use different email for another',
    ],
  },
});

ShopSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'shop',
  localField: '_id',
});
ShopSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'shop',
  localField: '_id',
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
