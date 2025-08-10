// routes/admin.js

const express = require("express");
const router = express.Router();
const { authorizedAdmin } = require("../middleware/authorization");
const adminService = require("../services/adminService");
const userService = require("../services/userService"); // assuming you have one
const { DataNotFound } = require("../errors");

/**
 * Utility to send a response with custom message and data
 * Equivalent to Kotlin's WithSuccessMessage
 */
function withSuccessMessage(result, message) {
  return { ...result, message };
}

/** ----------- Protected Admin Routes (require admin JWT) ---------- **/

// POST /management/changePassword
router.post(
  "/management/changePassword",
  authorizedAdmin,
  async (req, res, next) => {
    try {
      const request = req.body; // Should match AdminChangePasswordRequest fields
      const userID = req.user.id; // set by authorizedAdmin middleware
      const result = await adminService.changePassword(request, userID);
      res.json(withSuccessMessage(result, "Password changed successfully."));
    } catch (err) {
      next(err);
    }
  }
);

// GET /management/users?p=1
router.get("/management/users", authorizedAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.p, 10) || 1;
    const users = await userService.getAllUsers(page);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /management/user/account?u={id}
router.get(
  "/management/user/account",
  authorizedAdmin,
  async (req, res, next) => {
    try {
      const userId = parseInt(req.query.u, 10);
      if (!userId) throw new DataNotFound();
      const result = await userService.toggleBlock(userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/** ----------------- Public Admin Auth/Password Routes -------------------- **/

// POST /management/updateFGPassword
router.post("/management/updateFGPassword", async (req, res, next) => {
  try {
    const request = req.body; // Should match AdminForgotPasswordResetRequest
    const result = await adminService.verifyAndChangePassword(request);
    res.json(
      withSuccessMessage(
        result,
        "Your password has been updated. You will be redirected to login page."
      )
    );
  } catch (err) {
    next(err);
  }
});

// GET /management/validateReset?t={tokenId}
router.get("/management/validateReset", async (req, res, next) => {
  try {
    const tokenId = parseInt(req.query.t, 10);
    if (!tokenId) throw new DataNotFound();
    const result = await adminService.validateForgotPwdToken(tokenId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /management/login
router.post("/management/login", async (req, res, next) => {
  try {
    const request = req.body; // Should match AdminLoginRequest
    const result = await adminService.loginUser(request);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /management/resetPassword
router.post("/management/resetPassword", async (req, res, next) => {
  try {
    const request = req.body; // Should match AdminForgotPasswordRequest
    const result = await adminService.forgotPassword(request);
    res.json(
      withSuccessMessage(
        result,
        "A password reset link is sent to your registered email"
      )
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
