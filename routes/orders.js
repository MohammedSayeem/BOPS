const express = require("express");
const { createOrder, getAllOrders } = require("../controllers/orderController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect, restrictTo("user"));
router.route("/").post(createOrder).get(getAllOrders);

module.exports = router;
