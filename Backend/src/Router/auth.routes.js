const express = require('express');
const authController = require('../Controller/auth.Controller.js');
const authMiddleware = require("../Middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/me",authMiddleware.authUser,authController.getCurrentUser);

module.exports = router;