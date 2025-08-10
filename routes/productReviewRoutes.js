const express = require("express");
const router = express.Router();
const productReviewService = require("../services/productReviewService");
const { authorize, authorizedAdmin } = require("../middleware/authorization");
const { parseMultipartForm } = require("../utils/parseMultipart"); // Helper to parse multipart
const { DataNotFound } = require("../errors");

// --- Public product review routes ---
router.get("/product/review/list/product/reviews", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const productId = parseInt(req.query.p, 10) || 1;

    const reviews = await productReviewService.getProductReviews(
      productId,
      page
    );
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/product/review/average", async (req, res, next) => {
  try {
    const productId = parseInt(req.query.p, 10) || 1;
    const avg = await productReviewService.getAverageRating(productId);
    res.json(avg);
  } catch (err) {
    next(err);
  }
});

// --- User protected product review routes ---
router.get(
  "/product/review/delete/attachment",
  authorize,
  async (req, res, next) => {
    try {
      const id = parseInt(req.query.id, 10) || 1;
      const reviewId = parseInt(req.query.r, 10) || 1;
      const status = await productReviewService.deleteAttachment(reviewId, id);
      res.json(status);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/product/review/delete", authorize, async (req, res, next) => {
  try {
    const id = parseInt(req.query.id, 10) || 1;
    const userID = req.user?.id; // Assuming userID is stored on req.user by authorize middleware
    if (!userID) throw new DataNotFound("User not found in request");
    const status = await productReviewService.deleteProductReview(userID, id);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

// Helper middleware to handle multipart form (files + fields) for create and edit review
async function handleMultipartForm(req, res, next) {
  try {
    const { formFields, files } = await parseMultipartForm(req);
    req.formFields = formFields;
    req.files = files;
    next();
  } catch (err) {
    next(err);
  }
}

router.post(
  "/product/review/create",
  authorize,
  handleMultipartForm,
  async (req, res, next) => {
    try {
      const { formFields, files } = req;
      const productId = formFields.productId
        ? parseInt(formFields.productId, 10)
        : null;
      const rating = formFields.rating ? parseFloat(formFields.rating) : 1.0;
      const reviewText = formFields.review || "";
      const isVideo = (formFields.is_video || "false").toLowerCase() === "true";

      if (!productId) throw new DataNotFound("ProductId is required");

      // Filter attach* files
      const attachments = Object.entries(files)
        .filter(([key]) => key.startsWith("attach"))
        .map(([key, file]) => file);

      const request = {
        productId,
        rating,
        comment: reviewText,
        isVideo,
        attachments,
      };

      const userID = req.user.id;
      const status = await productReviewService.addProductReview(
        request,
        userID
      );
      res.json(status);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/product/review/edit",
  authorize,
  handleMultipartForm,
  async (req, res, next) => {
    try {
      const { formFields, files } = req;
      const productId = formFields.productId
        ? parseInt(formFields.productId, 10)
        : null;
      const id = formFields.id ? parseInt(formFields.id, 10) : null;
      const rating = formFields.rating ? parseFloat(formFields.rating) : 1.0;
      const reviewText = formFields.review || "";
      const isVideo = (formFields.is_video || "false").toLowerCase() === "true";

      if (!productId || !id)
        throw new DataNotFound("ProductId and review id are required");

      // Filter attach* files
      const attachments = Object.entries(files)
        .filter(([key]) => key.startsWith("attach"))
        .map(([key, file]) => file);

      const userID = req.user.id;
      const request = {
        id,
        productId,
        rating,
        comment: reviewText,
        isVideo,
        userId: userID,
        attachments,
      };

      const status = await productReviewService.editProductReview(
        request,
        userID
      );
      res.json(status);
    } catch (err) {
      next(err);
    }
  }
);

// --- Admin product review routes ---
router.get(
  "/product/review/list/all",
  authorizedAdmin,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const reviews = await productReviewService.getAllReviews(page);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/product/review/delete",
  authorizedAdmin,
  async (req, res, next) => {
    try {
      const id = parseInt(req.query.id, 10) || 1;
      const status = await productReviewService.deleteProductReview(id);
      res.json(status);
    } catch (err) {
      next(err);
    }
  }
);

// Optional duplicate admin delete route
router.get(
  "/product/review/admin/delete",
  authorizedAdmin,
  async (req, res, next) => {
    try {
      const id = parseInt(req.query.id, 10) || 1;
      const status = await productReviewService.deleteProductReview(id);
      res.json(status);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
