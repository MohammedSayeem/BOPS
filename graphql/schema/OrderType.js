const graphql = require('graphql');

const OrderModel = require('../../models/order');
const ProductModel = require('../../models/product');

const { dateScalar } = require('../CustomScalars/custom_scalars');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
} = graphql;

const OrderType = (types) =>
  new GraphQLObjectType({
    name: 'OrderType',
    fields: () => ({
      shop: {
        type: types.ShopType,
        resolve(parentValue) {
          return OrderModel.findById(parentValue)
            .populate('shop')
            .then((order) => order.shop);
        },
      },
      _id: {
        type: GraphQLString,
      },
      user: {
        type: GraphQLString,
      },
      placedAt: {
        type: dateScalar,
      },
      status: {
        type: GraphQLString,
      },
      items: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'items',
            fields: () => ({
              product: {
                type: types.ProductType,
                resolve(parentValue) {
                  return ProductModel.findById(parentValue.product)
                    .populate('product')
                    .then((order) => order);
                },
              },
              quantity: {
                type: GraphQLFloat,
              },
            }),
          })
        ),
      },
      amount: {
        type: GraphQLFloat,
      },
    }),
  });

module.exports = OrderType;
