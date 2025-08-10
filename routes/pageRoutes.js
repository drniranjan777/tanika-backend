const express = require("express");
const router = express.Router();
const pageService = require("../services/pageService"); // your service layer
const { authorizedAdmin } = require("../middleware/authorization");
const { DataNotFound } = require("../errors");
const { parseMultipartForm } = require("../utils/parseMultipart"); // helper like your Kotlin parse()

// Public routes

// GET /pages/:url
router.get("/pages/:url", async (req, res, next) => {
  try {
    const pageUrl = req.params.url;
    if (!pageUrl) throw new DataNotFound("Page URL not provided");
    const page = await pageService.getPage(pageUrl);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// GET /pages/published/list?p=1
router.get("/pages/published/list", async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.p, 10) || 1;
    const pages = await pageService.getPages(pageNo, true);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// Admin-protected routes

// GET /pages?p=1 (all pages, including unpublished)
router.get("/pages", authorizedAdmin, async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.p, 10) || 1;
    const pages = await pageService.getPages(pageNo, false);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// POST /pages/create
router.post("/pages/create", authorizedAdmin, async (req, res, next) => {
  try {
    const request = req.body; // you may validate this with a schema
    const status = await pageService.createPage(request);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

// POST /pages/update
router.post("/pages/update", authorizedAdmin, async (req, res, next) => {
  try {
    const request = req.body;
    const status = await pageService.updatePage(request);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

// GET /pages/delete?id=123
router.get("/pages/delete", authorizedAdmin, async (req, res, next) => {
  try {
    const pageId = parseInt(req.query.id, 10);
    if (!pageId) throw new DataNotFound("Page ID not provided");
    const status = await pageService.deletePage(pageId);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

// POST /pages/upload (multipart: files + fields)
router.post("/pages/upload", authorizedAdmin, async (req, res, next) => {
  try {
    // Assuming you have multer handling the upload
    // For example multer middleware applied before this handler

    // If using a custom helper to parse multipart:
    const { formFields, files } = await parseMultipartForm(req);
    const fileList = Object.values(files).filter(Boolean);
    const urls = await pageService.insertImage(fileList);
    res.json(urls);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
