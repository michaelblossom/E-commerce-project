const express = require("express");
const cartController = require("../controllers/cartController");
// const authController = require("./../controller/authController");

const router = express.Router();
// router.route("/").post(productController.createProduct);
router
  .route("/")
  .get(cartController.getAllCarts)
  .post(cartController.createCart);

router
  .route("/:id")
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);
module.exports = router;
