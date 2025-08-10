const express = require("express");
const router = express.Router();
const { DataNotFound } = require("../errors");
const wishlistService = require("../services/wishlistService");
const { authorizeOrNull } = require("../middleware/authorization"); // middleware that optionally authenticates user

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /wishlist/:page?p=1 or /wishlist/1?d=deviceId

router.get(
  "/wishlist/:page",
  authorizeOrNull,
  asyncHandler(async (req, res) => {
    try {
      const user = req.user || null;
      const pageNo = parseInt(req.params.page, 10) || 1;

      if (user) {
        const data = await wishlistService.getProducts(user.id, null, pageNo);
        res.json(data);
      } else {
        const deviceID = req.query.d;
        if (!deviceID)
          throw new DataNotFound("Device ID missing for guest wishlist");
        const data = await wishlistService.getProducts(null, deviceID, pageNo);
        res.json(data);
      }
    } catch (err) {
      next(err);
    }
  })
);

// GET /wishlist/add?p=productId&d=deviceId (guest) or with user auth
router.get("/wishlist/add", authorizeOrNull, async (req, res, next) => {
  try {
    const user = req.user || null;
    const productID = parseInt(req.query.p, 10);
    if (!productID) throw new DataNotFound("Product ID is required");

    if (user) {
      const status = await wishlistService.addItem(user.id, null, productID);
      res.json(status);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID missing for guest wishlist add");
      const status = await wishlistService.addItem(null, deviceID, productID);
      res.json(status);
    }
  } catch (err) {
    next(err);
  }
});

// GET /wishlist/delete?p=productId&d=deviceId (guest) or with user auth
router.get("/wishlist/delete", authorizeOrNull, async (req, res, next) => {
  try {
    const user = req.user || null;
    const productID = parseInt(req.query.p, 10);
    if (!productID) throw new DataNotFound("Product ID is required");

    if (user) {
      const status = await wishlistService.removeItem(user.id, null, productID);
      res.json(status);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID missing for guest wishlist delete");
      const status = await wishlistService.removeItem(
        null,
        deviceID,
        productID
      );
      res.json(status);
    }
  } catch (err) {
    next(err);
  }
});

// GET /wishlist/check?p=productId&d=deviceId (guest) or with user auth
router.get("/wishlist/check", authorizeOrNull, async (req, res, next) => {
  try {
    const user = req.user || null;
    const productID = parseInt(req.query.p, 10);
    if (!productID) throw new DataNotFound("Product ID is required");

    if (user) {
      const status = await wishlistService.inWishlist(productID, null, user.id);
      res.json(status);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID missing for guest wishlist check");
      const status = await wishlistService.inWishlist(
        productID,
        deviceID,
        null
      );
      res.json(status);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
