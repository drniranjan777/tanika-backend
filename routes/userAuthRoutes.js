const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const {
  validateOTPLoginRequest,
  validateOTPLoginVerificationRequest,
} = require("../validators/userValidator");
const { authorize } = require("../middleware/authorization");
const { DataNotFoundError } = require("../errors"); // You can define app-specific error classes

// POST /auth/otp/login - send OTP for login
router.post("/auth/otp/login", async (req, res) => {
  try {
    // Validate request body
    const { error } = validateOTPLoginRequest(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const result = await userService.loginWithOTP(req.body);
    res.json({ data: result, message: "OTP Successfully sent." });
  } catch (err) {
    // handle or propagate your errors suitably
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

// POST /auth/otp/login/verify - verify OTP and login user
router.post("/auth/otp/login/verify", async (req, res) => {
  try {
    // Validate request body
    const { error } = validateOTPLoginVerificationRequest(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const result = await userService.verifyOTPLogin(req.body);
    res.json({ data: result, message: "OTP Successfully verified." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

// GET /otp/resend?id=123 - resend OTP
router.get("/otp/resend", async (req, res) => {
  try {
    const userId = parseInt(req.query.id, 10);
    if (!userId) throw new DataNotFoundError("User ID is required");

    // Optionally, you can protect this route with authorization middleware if needed:
    // router.get('/otp/resend', authorize, async (req, res) => { ... });

    const result = await userService.resendOtp(userId);
    res.json({ data: result, message: "OTP Successfully sent." });
  } catch (err) {
    if (err instanceof DataNotFoundError) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

module.exports = router;
