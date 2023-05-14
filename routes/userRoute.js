const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
// ROUTES
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// route to get the currently logged user details
router.get("/me", userController.getMe, userController.getUser);

router.route("/").get(userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
