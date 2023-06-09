const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

// const productController = require("../controllers/productController");
// const authController = require("./../controller/authController");

const router = express.Router();
router
  .route("/add-to-wishlist")
  .patch(authController.protect, productController.addToWishlist);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
