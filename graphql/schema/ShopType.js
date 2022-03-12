const graphql = require('graphql');
const UserType = require('./UserType');
const ShopModel = require('../../models/shop');
const OrderModel = require('../../models/order');

const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } = graphql;

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    type: {
      type: GraphQLString,
    },
    coordinates: {
      type: new GraphQLList(GraphQLFloat),
    },
  }),
});

const ShopType = (types) =>
  new GraphQLObjectType({
    name: 'ShopType',
    fields: () => ({
      owner: {
        type: types.UserType,
        resolve(parentValue, args, req) {
          // if (req.user && req.user.role === "admin") {
          return ShopModel.findById(parentValue)
            .populate('owner')
            .then((shop) => shop.owner);
          // }
          // return null;
        },
      },
      _id: {
        type: GraphQLString,
      },
      image: {
        type: GraphQLString,
      },
      name: {
        type: GraphQLString,
      },
      location: {
        type: LocationType,
      },
      avgRating: {
        type: GraphQLFloat,
      },
      ratings: {
        type: new GraphQLList(GraphQLFloat),
      },
      orders: {
        type: new GraphQLList(types.OrderType),
        resolve(parentValue, args, req) {
          if (req.user && req.user.role === 'admin') {
            return ShopModel.findById(parentValue)
              .populate('orders')
              .then((shop) => shop.orders);
          }
          return null;
        },
      },
      products: {
        type: new GraphQLList(types.ProductType),
        resolve(parentValue, args, req) {
          return ShopModel.findOne(parentValue)
            .populate('products')
            .then((shop) => shop.products);
        },
      },
    }),
  });

module.exports = ShopType;
