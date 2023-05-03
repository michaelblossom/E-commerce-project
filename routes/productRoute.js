const express = require("express");
const productController = require("../controllers/productController");
// const authController = require("./../controller/authController");

const router = express.Router();
// router.route("/").post(productController.createProduct);
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    // productController.uploadProductImages,
    // productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
