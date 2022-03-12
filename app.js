const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Razorpay = require('razorpay');

const ErrorHandler = require('./controllers/errorController');
const { cloudinaryConfig } = require('./utils/cloudinaryConfig');

const { protect } = require('./controllers/authController');

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const shopsRouter = require('./routes/shops');
const ordersRouter = require('./routes/orders');

const schema = require('./graphql/schema/schema');
const User = require('./models/user');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use(cloudinaryConfig);

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/shops', shopsRouter);
app.use('/orders', ordersRouter);
app.use(protect);

app.use('/payments', (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    instance.orders.create(
      {
        amount: req.body.amount,
        currency: req.body.currency,
      },
      async (err, order) => {
        const user = await User.findById(req.user.id);
        await user.update({
          $set: {
            active_order_id: order.id,
          },
        });

        res.status(201).json({
          order,
        });
      }
    );
  } catch (e) {
    res.status(501).json({
      status: 'fail',
    });
  }
});

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);
// error handler
app.use(ErrorHandler);

module.exports = app;
