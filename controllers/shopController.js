const Shop = require('../models/shop');
const multer = require('multer');
const DataUriParser = require('datauri/parser');

const { uploader } = require('../utils/cloudinaryConfig');
const catchAsync = require('../utils/catchAsync');

const dUri = new DataUriParser();

const upload = multer({
  storage: multer.memoryStorage(),
});

const shopImageUpload = upload.single('image');

const dataUri = (req, filename) => dUri.format(filename, req.file.buffer);

const createShop = catchAsync(async (req, res, next) => {
  if (req.file) {
    const filename = `${req.body.name}-${Date.now()}-${req.file.originalname}`;
    console.log(filename);
    const file = dataUri(req, filename).content;
    const result = await uploader.upload(file, {
      use_filename: true,
    });
    req.body.image = result.url;
  }
  req.body.location = JSON.parse(req.body.location);
  const shop = await Shop.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      shop,
    },
  });
});

const getAllShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.find();
  res.json({
    status: 'success',
    data: {
      shops,
    },
  });
});

module.exports = {
  getAllShops,
  createShop,
  shopImageUpload,
};
