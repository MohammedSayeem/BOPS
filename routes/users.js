const express = require("express");

const { getAllUsers, createUser } = require("../controllers/userController");
const ordersRouter = require("../routes/orders");
const {
  signup,
  signin,
  protect,
  restrictTo,
  updatePassword,
  updateDetails,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

/* GET users listing. */
router.use(protect);

router.use("/:userId/orders", ordersRouter);
router.post("/updatepassword", updatePassword);
router.patch("/updateme", updateDetails);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
