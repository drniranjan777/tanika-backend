const express = require("express");
const router = express.Router();
const settingsService = require("../services/settingsService");
const { authorizedAdmin } = require("../middleware/authorization");
// Middleware to verify admin authorization
const asyncHandler = require("express-async-handler"); // to wrap async routes for error handling

// GET /settings - public route to get current settings
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const settings = await settingsService.getSettings();
    res.json({ status: 200, data: settings });
  })
);

// POST /settings/save - admin-protected to create/update settings
router.post(
  "/save",
  authorizedAdmin,
  express.json(), // to parse JSON body
  asyncHandler(async (req, res) => {
    // Assume express.json() middleware enabled to parse JSON request body
    const request = req.body; // Should match SettingsRequest shape
    const result = await settingsService.saveSettings(request);
    res.json({ status: 200, data: result });
  })
);

module.exports = router;
