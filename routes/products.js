const express = require("express");
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
  productImageUpload,
} = require("../controllers/productController");

const router = express.Router({
  mergeParams: true,
});

router.route("/").get(getAllProducts).post(productImageUpload, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .patch(productImageUpload, updateProduct)
  .delete(deleteProduct);

module.exports = router;
