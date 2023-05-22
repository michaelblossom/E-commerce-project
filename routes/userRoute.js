const crypto = require("crypto"); //this is a built in function basically use for generating randon strings expecially (passwordreset token)

const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
// ROUTES
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.post("/forgotPassword", authController.forgotPassword);


// route to get the currently logged user details
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);

// route to block/disable user
router.delete("/deleteMe", userController.deleteMe);

// get how many users that registered per month
router.get(
  "/getMonthlyRegisteredUsers",
  userController.getMonthlyRegisteredUsers
);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
