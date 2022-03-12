const graphql = require('graphql');

const ProductModel = require('../../models/product');

const { GraphQLObjectType, GraphQLFloat, GraphQLString, GraphQLBoolean } =
  graphql;

const ProductType = (types) =>
  new GraphQLObjectType({
    name: 'ProductType',
    fields: () => ({
      name: {
        type: GraphQLString,
      },
      _id: {
        type: GraphQLString,
      },
      inStock: {
        type: GraphQLBoolean,
      },
      price: {
        type: GraphQLFloat,
      },
      image: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      shop: {
        type: GraphQLString,
      },
    }),
  });

module.exports = ProductType;
