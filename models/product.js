const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product should have a name"],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
    min: [5, "A product's price should be atleast Rs.5"],
  },
  shop: {
    type: mongoose.Types.ObjectId,
    ref: "Shop",
    required: [true, "A product should belong to a Shop"],
  },
  image: {
    type: String,
    required: true,
    default: "image.jpg",
  },
  description: {
    type: String,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
