const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
// ROUTES
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// route to get the currently logged user details
router.get("/me", userController.getMe, userController.getUser);

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
