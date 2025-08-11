const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userService = require("../services/frontendUserService");

// Register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const user = await userService.registerUser(req.body);
    res.json({ status: 201, message: "User registered", user });
  })
);

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await userService.loginUser(req.body);
    res.json({ status: 200, message: "Login successful", data });
  })
);

// Forgot password
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { gmail } = req.body;
    const result = await userService.forgotPassword(gmail);
    res.json({ status: 200, ...result });
  })
);

// Reset password
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await userService.resetPassword(token, password);
    res.json({ status: 200, ...result });
  })
);

module.exports = router;
