const UserModel = require('../../models/user');
const jwt = require('jsonwebtoken');

const getAllUsers = (req) => {
  if (!req.user) {
    return null;
  } else if (!(req.user.role === 'admin')) {
    return UserModel.find({ _id: req.user.id });
  }
  return UserModel.find().sort('-createdAt');
};

const getUser = (req, token) => {
  let verified;
  if (token && token.length) {
    verified = jwt.verify(token, process.env.JWT_SECRET);
    return UserModel.findById(verified.id);
  }
  if (!req.user) {
    return null;
  }
  // if (req.user.role === 'shopOwner') {
  //   return UserModel.findById(req.user.id).populate('shop');
  // }
  return UserModel.findById(req.user.id);
};

module.exports = { getAllUsers, getUser };
