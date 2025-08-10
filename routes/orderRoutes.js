const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");
const { DataNotFound } = require("../errors");
const { authorize, authorizedAdmin } = require("../middleware/authorization");

/**
 * GET /orders/:page
 * Get user's orders paginated
 */
router.get("/orders/:page", authorize, async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.page, 10) || 1;
    const userID = req.user.id;
    const orders = await orderService.getOrders(null, pageNo, userID);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders/view/:id
 * Get one user order detail by ID
 */
router.get("/orders/view/:id", authorize, async (req, res, next) => {
  try {
    const orderID = parseInt(req.params.id, 10);
    if (!orderID) throw new DataNotFound("Order ID not provided");
    const userID = req.user.id;
    const order = await orderService.getOrder(orderID, userID);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order/list/:page
 * Admin: list orders with optional search query
 */
router.get("/order/list/:page", authorizedAdmin, async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.page, 10) || 1;
    const query = req.query.q || null;
    const orders = await orderService.getOrders(query, pageNo, null);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order/list/view/:id
 * Admin: get order detail by ID
 */
router.get("/order/list/view/:id", authorizedAdmin, async (req, res, next) => {
  try {
    const orderID = parseInt(req.params.id, 10);
    if (!orderID) throw new DataNotFound("Order ID not provided");
    const order = await orderService.getOrder(orderID);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /order/status
 * Admin: change order status
 */
router.post("/order/status", authorizedAdmin, async (req, res, next) => {
  try {
    const request = req.body; // Expect ChangeOrderRequest shape
    const status = await orderService.changeOrderStatus(request);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders/addresses
 * Get user's previous shipping addresses
 */
router.get("/orders/addresses", authorize, async (req, res, next) => {
  try {
    const userID = req.user.id;
    const addresses = await orderService.getPreviousAddress(userID);
    res.json(addresses);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orderStatistics
 * Admin: get order statistics filtered by date range
 */
router.get("/orderStatistics", authorizedAdmin, async (req, res, next) => {
  try {
    const startDate = req.query.s ? new Date(req.query.s) : null;
    const endDate = req.query.e ? new Date(req.query.e) : null;
    if (startDate && endDate) {
      const stats = await orderService.getStats(startDate, endDate);
      res.json(stats);
    } else {
      res.json({ message: "Date range required", data: {} });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * POST /orders/checkout
 * User: create new order
 */
router.post("/orders/checkout", authorize, async (req, res, next) => {
  try {
    const request = req.body; // Expect CreateOrderRequest shape
    const userID = req.user.id;
    const orderResponse = await orderService.createOrder(userID, request);
    res.json(orderResponse);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /orders/status
 * User: confirm order payment success
 */
router.post("/orders/status", authorize, async (req, res, next) => {
  try {
    const request = req.body; // Expect ConfirmOrderRequest shape
    const userID = req.user.id;
    const status = await orderService.setOrderSuccess(userID, request);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
