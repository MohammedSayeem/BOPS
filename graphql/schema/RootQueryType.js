const graphql = require('graphql');

const ShopModel = require('../../models/shop');
const ProductModel = require('../../models/product');
const OrderModel = require('../../models/order');

const { getAllUsers, getUser } = require('../repositories/UserRepositories');
const { getAllShops, getShop } = require('../repositories/ShopRepositories');
const { getAllOrders } = require('../repositories/OrderRepositories');

const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } =
  graphql;

const RootQueryType = (types) =>
  new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      users: {
        type: new GraphQLList(types.UserType),
        resolve(parentValue, args, req) {
          return getAllUsers(req);
        },
      },
      user: {
        type: types.UserType,
        args: {
          token: {
            type: GraphQLString,
          },
        },
        resolve(parentValue, { token }, req) {
          return getUser(req, token);
        },
      },
      shops: {
        type: new GraphQLList(types.ShopType),
        resolve(parentValue, args, req) {
          return getAllShops(req);
        },
      },
      shop: {
        type: types.ShopType,
        args: {
          shopId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parentValue, { shopId }, req) {
          return getShop(req, shopId);
        },
      },
      products: {
        type: new GraphQLList(types.ProductType),
        resolve() {
          return ProductModel.find();
        },
      },
      orders: {
        type: new GraphQLList(types.OrderType),
        args: {
          shopId: {
            type: GraphQLString,
          },
        },
        resolve(parentValue, { shopId }, req) {
          return getAllOrders(req, shopId).sort('-placedAt');
        },
      },
    }),
  });

module.exports = RootQueryType;
