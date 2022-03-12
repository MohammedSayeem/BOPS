const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please Enter a valid email'],
    },
    fullname: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'shopOwner', 'admin'],
    },

    mobile: {
      type: String,
      required: true,
      minlength: 10,
      validate: [
        /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        'Please enter a valid phone number',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    active_order_id: {
      type: String,
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const encpass = await bcrypt.hash(this.password, 10);
  this.password = encpass;
  next();
});
UserSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id',
});
UserSchema.virtual('shop', {
  ref: 'Shop',
  foreignField: 'owner',
  localField: '_id',
});
UserSchema.methods.comparePassword = async function (
  encryptedPassword,
  normalPassword
) {
  return await bcrypt.compare(normalPassword, encryptedPassword);
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
