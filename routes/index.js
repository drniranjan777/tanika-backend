const express = require("express");
const router = express.Router();
// const container = require("../utils/container");

const addressRoutes = require("./addressRoutes");
const userAuthRoutes = require("./userAuthRoutes");
const cartRoutes = require("./cartRoutes");
const productRoutes = require("./productRoutes");
const productReviewRoutes = require("./ProductReviewRoutes");
const adminRoutes = require("./adminRoutes");
const pageRoutes = require("./pageRoutes");
const orderRoutes = require("./orderRoutes");
const settingsRoutes = require("./settingsRoutes");
const uiRoutes = require("./uiRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const testimonialRoutes = require("./testimonialRoutes")
const homePageGridRoutes = require("./homepageGridRoutes")
const userRoutes = require("./frontendUserRoute")

// router.use("/auth", userAuthRoutes);
router.use("/address", addressRoutes);
router.use("/cart", cartRoutes);
router.use("/products", productRoutes);
router.use("/product/reviews", productReviewRoutes);
router.use("/admin", adminRoutes);
router.use("/pages", pageRoutes);
router.use("/orders", orderRoutes);
router.use("/settings", settingsRoutes);
router.use("/ui", uiRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/testimonial", testimonialRoutes);
router.use("/homepage-grid", homePageGridRoutes);
router.use("/auth", userRoutes);

module.exports = router;
