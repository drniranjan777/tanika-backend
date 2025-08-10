const express = require("express");
const multer = require("multer");
const router = express.Router();

const productService = require("../services/productService"); // your Node.js product service
const { authorizedAdmin } = require("../middleware/authorization");
const { DataNotFound, InvalidRequest } = require("../errors");
const { parseMultipartForm } = require("../utils/parseMultipart.js"); // helper to parse multipart form, explained below
const { ProductSortOrder } = require("../models/common/ProductSortOrder"); // adapt as needed

// Multer setup for file uploads in memory or disk storage (example with memory)
const upload = multer({ storage: multer.memoryStorage() });

// Protected routes - require admin authorization

// POST /products/create
router.post("/products/create", authorizedAdmin, async (req, res, next) => {
  try {
    const { formFields, files } = await parseMultipartForm(req);

    // Validate required fields
    const name = formFields.name;
    const description = formFields.description;
    const thumbnail = files.thumbnail;
    if (!name || !description || !thumbnail) throw new InvalidRequest();

    const visibility = formFields.visibility === "true"; // careful conversion from string
    if (typeof visibility !== "boolean") throw new InvalidRequest();

    const price = parseFloat(formFields.price);
    if (isNaN(price)) throw new InvalidRequest();

    const discount = parseFloat(formFields.discount);
    if (isNaN(discount)) throw new InvalidRequest();

    const isFeatured = formFields.isFeatured === "true";

    // Collect all screen files (keys beginning with "screen")
    const screens = Object.entries(files)
      .filter(([key]) => key.startsWith("screen"))
      .map(([, file]) => file);

    const createRequest = {
      name,
      description,
      thumbnail,
      visibility,
      screens,
      price,
      discount,
      isFeatured,
    };

    const product = await productService.addProduct(createRequest);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// GET /products/delete?id=xxx
router.get("/products/delete", authorizedAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) throw new DataNotFound();
    const result = await productService.deleteProduct(id);
    res.json({ status: result });
  } catch (error) {
    next(error);
  }
});

// POST /products/edit/:id
router.post("/products/edit/:id", authorizedAdmin, async (req, res, next) => {
  try {
    const { formFields, files } = await parseMultipartForm(req);
    const id = parseInt(req.params.id, 10);
    if (!id) throw new DataNotFound();

    const name = formFields.name;
    const description = formFields.description;
    const thumbnail = files.thumbnail || null; // optional for edit
    if (!name || !description) throw new InvalidRequest();

    const visibility = formFields.visibility === "true";
    const price = parseFloat(formFields.price);
    const discount = parseFloat(formFields.discount);
    const isFeatured = formFields.isFeatured === "true";

    const screens = Object.entries(files)
      .filter(([key]) => key.startsWith("screen"))
      .map(([, file]) => file);

    const removedScreens = Object.entries(formFields)
      .filter(([key]) => key.startsWith("removed"))
      .map(([, val]) => val);

    const editRequest = {
      id,
      name,
      description,
      thumbnail,
      visibility,
      price,
      discount,
      isFeatured,
      screens,
      removedScreens,
    };

    const updated = await productService.updateProduct(editRequest);
    res.json({ status: updated });
  } catch (error) {
    next(error);
  }
});

// Public product routes

// GET /products/:pageNo?s=sectionId&c=categoryId&f=filterList&o=sortOrder
router.get("/products/:pageNo", async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.pageNo, 10) || 1;

    // sectionId and categoryId could be strings or numbers depending on your repo implementation
    const sectionId = req.query.s ? parseInt(req.query.s, 10) : null;
    const categoryId = req.query.c ? parseInt(req.query.c, 10) : null;

    const filterList = req.query.f
      ? req.query.f
          .split(",")
          .map((v) => parseInt(v, 10))
          .filter(Boolean)
      : null;
    const sortOrderIndex = req.query.o ? parseInt(req.query.o, 10) : null;
    const sortOrder = ProductSortOrder.fromOrdinal(sortOrderIndex); // implement this utility accordingly

    const products = await productService.getProducts(
      sectionId,
      categoryId,
      filterList,
      sortOrder,
      pageNo
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /products/list/:pageNo?s=section&c=category&f=filter&o=sort
router.get("/products/list/:pageNo", async (req, res, next) => {
  // This route appears very similar to the previous, you can consider merging or aliasing
  try {
    const pageNo = parseInt(req.params.pageNo, 10) || 1;
    const sectionId = req.query.s || null; // Could be string or number
    const categoryId = req.query.c || null;
    const filterList = req.query.f
      ? req.query.f
          .split(",")
          .map((v) => parseInt(v, 10))
          .filter(Boolean)
      : null;
    const sortOrderIndex = req.query.o ? parseInt(req.query.o, 10) : null;
    const sortOrder = ProductSortOrder.fromOrdinal(sortOrderIndex);

    const products = await productService.getProducts(
      sectionId,
      categoryId,
      filterList,
      sortOrder,
      pageNo
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /products/search/:pageNo?q=queryString
router.get("/products/search/:pageNo", async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.pageNo, 10) || 1;
    const query = req.query.q || "";
    if (!query.trim()) return res.json({ totalCount: 0, data: [] }); // Return empty PaginatedData equivalent
    const result = await productService.getProductsBySearch(query, pageNo);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /product/:url
router.get("/product/:url", async (req, res, next) => {
  try {
    const url = req.params.url;
    if (!url) throw new DataNotFound();
    const product = await productService.getProduct(url);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// GET /product/related?id=productId
router.get("/product/related", async (req, res, next) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) throw new DataNotFound();
    const relatedProducts = await productService.getRelatedProducts(id);
    res.json(relatedProducts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
