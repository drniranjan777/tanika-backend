const express = require("express");
const router = express.Router();
const homepageGridService = require("../services/homepageGridService");
const asyncHandler = require("express-async-handler");
const { authorizedAdmin } = require("../middleware/authorization");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await homepageGridService.getAll();
    res.json({ status: 200, data });
  })
);

router.get(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const data = await homepageGridService.getById(req.params.id);
    res.json({ status: 200, data });
  })
);

router.post(
  "/",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const created = await homepageGridService.addItem(req.body);
    res.json({ status: 200, data: created });
  })
);

router.put(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const updated = await homepageGridService.updateItem(req.params.id, req.body);
    res.json({ status: 200, data: updated });
  })
);

router.delete(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const deleted = await homepageGridService.deleteItem(req.params.id);
    res.json({ status: 200, data: deleted });
  })
);

module.exports = router;
