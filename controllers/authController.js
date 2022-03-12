const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/user");
const filterObj = require("../utils/filterObj");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  return token;
};
const sendToken = (user, res, statusCode) => {
  const token = signToken(user._id);
  // const cookieOptions = {
  //   expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  //   httpOnly: true
  // };
  // res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.originalUrl.startsWith("/graphql")) {
    return next();
  } else {
    return next(new AppError(400, "Please login to access this route"));
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(id);
  req.user = user;
  next();
});

const updateDetails = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    filterObj(req.body, "fullname"),
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    data: {
      user,
    },
  });
});
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  const correct = await user.comparePassword(user.password, currentPassword);
  if (!correct) {
    return next(new AppError(400, "Incorrect password"));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, res, 200);
});
const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new AppError(400, "Invalid email or password"));
  }
  const correct = await user.comparePassword(user.password, password);
  if (!correct) {
    return next(new AppError(400, "Invalid email or password"));
  }
  sendToken(user, res, 200);
});
const signup = catchAsync(async (req, res, next) => {
  const { body } = req;
  const filteredBody = filterObj(
    body,
    "email",
    "fullname",
    "mobile",
    "password"
  );
  const newUser = await User.create(filteredBody);
  sendToken(newUser, res, 201);
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(401, "You are not allowed to perform this action")
      );
    }
    next();
  };
};
module.exports = {
  signin,
  signup,
  restrictTo,
  protect,
  updateDetails,
  updatePassword,
};
