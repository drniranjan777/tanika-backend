const express = require("express");
const router = express.Router();
const cartService = require("../services/cartService");
const { authorizeOrNull } = require("../middleware/authorization"); // custom middleware to get user or null
const DataNotFound = require("../errors"); // custom error class

// Middleware: authorizeOrNull attaches req.user or null if unauthenticated

// GET /cart - get cart summary
router.get("/", authorizeOrNull, async (req, res) => {
  try {
    const user = req.user || null;
    let data;
    if (user) {
      data = await cartService.getItems(null, user.id);
    } else {
      const deviceID = req.query.d;
      if (deviceID) {
        data = await cartService.getItems(deviceID, null);
      } else {
        data = { total: 0, items: [], count: 0 }; // equivalent to CartSummary.empty()
      }
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

// GET /add - add item to cart
router.get("/add", authorizeOrNull, async (req, res) => {
  try {
    const user = req.user || null;
    const productId = parseInt(req.query.p, 10);
    const sizeId = parseInt(req.query.s, 10);
    // qty is optional, default to 1
    const qty = req.query.q ? parseInt(req.query.q, 10) : 1;

    if (isNaN(productId) || isNaN(sizeId)) {
      throw new DataNotFound("Missing product or size ID");
    }

    let result;
    if (user) {
      result = await cartService.addItem(null, user.id, productId, sizeId, qty);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID is required for anonymous cart");
      result = await cartService.addItem(
        deviceID,
        null,
        productId,
        sizeId,
        qty
      );
    }
    res.json(result);
  } catch (err) {
    const status = err instanceof DataNotFound ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// GET /remove - remove item from cart
router.get("/remove", authorizeOrNull, async (req, res) => {
  try {
    const user = req.user || null;
    const cartID = parseInt(req.query.c, 10);
    if (isNaN(cartID)) {
      throw new DataNotFound("Cart ID is required");
    }

    let result;
    if (user) {
      result = await cartService.deleteItem(null, user.id, cartID);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID required for anonymous cart");
      result = await cartService.deleteItem(deviceID, null, cartID);
    }
    res.json(result);
  } catch (err) {
    const status = err instanceof DataNotFound ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// GET /empty - empty cart
router.get("/empty", authorizeOrNull, async (req, res) => {
  try {
    const user = req.user || null;
    let result;
    if (user) {
      result = await cartService.emptyCart(null, user.id);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID required for anonymous cart");
      result = await cartService.emptyCart(deviceID, null);
    }
    res.json(result);
  } catch (err) {
    const status = err instanceof DataNotFound ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// GET /updateQty - update quantity of cart item
router.get("/updateQty", authorizeOrNull, async (req, res) => {
  try {
    const user = req.user || null;
    const qty = parseInt(req.query.q, 10);
    const id = parseInt(req.query.id, 10);
    if (isNaN(qty) || isNaN(id)) {
      throw new DataNotFound("Quantity and ID are required");
    }

    let result;
    if (user) {
      result = await cartService.updateQty(null, user.id, id, qty);
    } else {
      const deviceID = req.query.d;
      if (!deviceID)
        throw new DataNotFound("Device ID required for anonymous cart");
      result = await cartService.updateQty(deviceID, null, id, qty);
    }
    res.json(result);
  } catch (err) {
    const status = err instanceof DataNotFound ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

module.exports = router;
