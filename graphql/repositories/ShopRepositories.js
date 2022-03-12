const { GraphQLError } = require('graphql');
const ShopModel = require('../../models/shop');

const getAllShops = (req) => {
  // if (req.user && req.user.role === "user") {
  // return ShopModel.find().select('-owner -orders');
  return ShopModel.find();
  // }
  // return ShopModel.find();
};

const getShop = async (req, shopId) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return ShopModel.findById(shopId);
    }
    const shop = await ShopModel.findById(shopId).select('-owner -orders');
    return shop;
  } catch (err) {
    if (err.name === 'CastError') {
      throw new GraphQLError('Invalid Shop Id');
    }
  }
};
module.exports = {
  getAllShops,
  getShop,
};
