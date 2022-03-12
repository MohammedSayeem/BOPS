const graphql = require('graphql');

const OrderType = require('./OrderType');
const UserModel = require('../../models/user');

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql;

const { dateScalar } = require('../CustomScalars/custom_scalars');

const UserType = (types) =>
  new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
      email: { type: GraphQLString },
      mobile: {
        type: GraphQLString,
      },
      _id: {
        type: GraphQLString,
      },
      fullname: {
        type: GraphQLString,
      },
      createdAt: {
        type: dateScalar,
      },
      role: {
        type: GraphQLString,
      },
      shop: {
        type: new GraphQLList(types.ShopType),
        resolve(parentValue) {
          return UserModel.findById(parentValue)
            .populate('shop')
            .then((user) => user.shop);
        },
      },
      orders: {
        type: new GraphQLList(types.OrderType),
        resolve(parentValue) {
          return UserModel.findById(parentValue)
            .populate('orders')
            .then((user) => user.orders);
        },
      },
    }),
  });

module.exports = UserType;
