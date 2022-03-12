const graphql = require('graphql');
const jwt = require('jsonwebtoken');
const Order = require('../../models/order');

// const UserType = require("./UserType");
const UserModel = require('../../models/user');

const { createOrder } = require('../repositories/OrderRepositories');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLError,
  GraphQLFloat,
  GraphQLList,
  GraphQLInputObjectType,
} = graphql;

const ItemsInputType = new GraphQLInputObjectType({
  name: 'orderitems',
  fields: () => ({
    product: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});
const RazorpayObjectType = new GraphQLInputObjectType({
  name: 'razorpayobj',
  fields: () => ({
    razorpay_payment_id: {
      type: GraphQLString,
    },
    razorpay_order_id: {
      type: GraphQLString,
    },
    razorpay_signature: {
      type: GraphQLString,
    },
  }),
});

const AuthObject = (types) =>
  new GraphQLObjectType({
    name: 'AuthObject',
    fields: () => ({
      user: {
        type: types.UserType,
      },
      token: {
        type: GraphQLString,
      },
    }),
  });

const mutation = (types) =>
  new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
      signin: {
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        type: AuthObject(types),
        async resolve(parentValue, args, req) {
          const { email, password } = args;
          const user = await UserModel.findOne({ email: email })
            .select('+password')
            .populate('shop');
          if (!user) {
            throw new GraphQLError('invalid email or password');
          }
          const correct = await user.comparePassword(user.password, password);
          if (!correct) {
            throw new GraphQLError('invalid email or password');
          }
          user.password = undefined;
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d',
          });
          return {
            user,
            token,
          };
        },
      },
      signup: {
        type: new GraphQLObjectType({
          name: 'NewAuthObject',
          fields: () => ({
            user: {
              type: types.UserType,
            },
            token: {
              type: GraphQLString,
            },
          }),
        }),
        args: {
          fullname: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          mobile: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        async resolve(parentValue, args) {
          try {
            const user = await UserModel.create(args);
            user.password = undefined;
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '2d',
            });
            return {
              user,
              token,
            };
          } catch (err) {
            if (err.keyValue) {
              const key = Object.keys(err.keyValue)[0];
              throw new GraphQLError(
                `Email ${err.keyValue[key]} Already registered`
              );
            }
            console.log(err.errors);
          }
        },
      },
      createOrder: {
        type: types.OrderType,
        args: {
          shop: {
            type: new GraphQLNonNull(GraphQLString),
          },
          user: {
            type: new GraphQLNonNull(GraphQLString),
          },
          amount: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          items: {
            type: new GraphQLNonNull(new GraphQLList(ItemsInputType)),
          },
          razorpayobj: {
            type: RazorpayObjectType,
          },
        },
        async resolve(parentValue, args, req) {
          return createOrder(req);
        },
      },
      createUser: {
        type: types.UserType,
        args: {
          fullname: {
            type: GraphQLString,
          },
          email: {
            type: GraphQLString,
          },
          mobile: {
            type: GraphQLString,
          },
          role: {
            type: GraphQLString,
          },
          password: {
            type: GraphQLString,
          },
        },
        resolve(parentValue, args, req) {
          return UserModel.create(args);
        },
      },
      isSignedIn: {
        type: types.UserType,
        resolve(parentValue, args, req) {
          if (req.user) {
            return req.user;
          }
          return null;
        },
      },
      updateOrderStatus: {
        type: types.OrderType,
        args: {
          orderId: {
            type: new GraphQLNonNull(GraphQLString),
          },
          status: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        async resolve(parentValue, { status, orderId }) {
          const order = await Order.findById(orderId);
          order.setOrderStatus(status);
          await order.save();
          return order;
        },
      },
    }),
  });

module.exports = mutation;
