const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("./../controllers/authController")
// // const authController = require("./../controller/authController");

const router = express.Router();
router.get("/myOrders",authController.protect, orderController.getMyOrder);

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
