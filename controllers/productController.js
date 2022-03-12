const multer = require('multer');
const DataUriParser = require('datauri/parser');

const Product = require('../models/product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterObj = require('../utils/filterObj');
const { uploader } = require('../utils/cloudinaryConfig');

const dUri = new DataUriParser();

const upload = multer({
  storage: multer.memoryStorage(),
});

const productImageUpload = upload.single('image');

const dataUri = (req, filename) => dUri.format(filename, req.file.buffer);

const getAllProducts = catchAsync(async (req, res, next) => {
  let products;
  if (req.params.shopId) {
    products = await Product.find({ shop: req.params.shopId });
  } else {
    products = await Product.find();
  }
  res.json({
    status: 'success',
    data: {
      products,
    },
  });
});
const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.json({
    status: 'success',
    data: {
      product,
    },
  });
});
const createProduct = catchAsync(async (req, res, next) => {
  if (req.file) {
    const filename = `${req.body.shop}-${Date.now()}-${req.file.originalname}`;
    const file = dataUri(req, filename).content;
    const result = await uploader.upload(file, {
      use_filename: true,
    });
    req.body.image = result.url;
  }
  const filteredObj = filterObj(
    req.body,
    'name',
    'price',
    'shop',
    'description',
    'image'
  );
  const newProduct = await Product.create(filteredObj);
  if (!newProduct) {
    return next(new AppError(400, 'Could not create a new product'));
  }
  res.status(201).json({
    status: 'success',
    data: {
      newProduct,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const filteredObj = filterObj(req.body, 'price', 'inStock', 'photo', 'name');
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    filteredObj,
    {
      new: true,
    }
  );
  if (!updatedProduct) {
    return next(new AppError(404, 'Product not found'));
  }
  res.json({
    status: 'success',
    data: {
      updatedProduct,
    },
  });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});
module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload,
};
