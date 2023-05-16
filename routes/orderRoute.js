const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("./../controllers/authController");
// // const authController = require("./../controller/authController");

const router = express.Router();
router.get("/myOrders", authController.protect, orderController.getMyOrder);

// get how many users that registered per month
router.get("/getOrdersPerMonth", orderController.getOrdersPerMonth);

// user that made the heighest order
router.get("/userWithHeighestOrder", orderController.userWithHeighestOrder);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
