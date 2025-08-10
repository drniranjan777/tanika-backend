const express = require("express");
const router = express.Router();
const addressService = require("../services/addressService");
const {
  validateCreateAddress,
  validateUpdateAddress,
} = require("../validators/addressValidator");
const { authorize } = require("../middleware/authorization"); // Example authorization middleware

// GET /address/list - get all addresses for authorized user
router.get("/list", authorize, async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /address/get?id=123 - get single address by id
router.get("/get", authorize, async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) {
    return res.status(400).json({ message: "Missing or invalid id parameter" });
  }

  try {
    const address = await addressService.getAddressById(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /address/create - create new address
router.post("/create", authorize, async (req, res) => {
  const { error } = validateCreateAddress(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newAddressId = await addressService.createAddress(
      req.user.id,
      req.body
    );
    res.status(201).json({ id: newAddressId });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /address/update - update existing address
router.post("/update", authorize, async (req, res) => {
  const updateData = { ...req.body };
  const { error } = validateUpdateAddress(updateData);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updated = await addressService.updateAddress(req.user.id, updateData);
    if (!updated) {
      return res
        .status(404)
        .json({ message: "Address not found or no changes made" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /address/delete?id=123 - delete address by id
router.get("/delete", authorize, async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) {
    return res.status(400).json({ message: "Missing or invalid id parameter" });
  }

  try {
    const deleted = await addressService.deleteAddress(id);
    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
