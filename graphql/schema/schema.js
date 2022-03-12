const graphql = require("graphql");

const RootQueryType = require("./RootQueryType");
const mutation = require("./mutations");

const UserTypeInject = require("./UserType");
const ShopTypeInject = require("./ShopType");
const ProductTypeInject = require("./ProductType");
const OrderTypeInject = require("./OrderType");

const types = {};
types.UserType = UserTypeInject(types);
types.ShopType = ShopTypeInject(types);
types.ProductType = ProductTypeInject(types);
types.OrderType = OrderTypeInject(types);

const { GraphQLSchema } = graphql;

const schema = new GraphQLSchema({
  query: RootQueryType(types),
  mutation: mutation(types),
});

module.exports = schema;
