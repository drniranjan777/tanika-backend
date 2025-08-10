const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "temp/uploads/" });
const { authorizedAdmin } = require("../middleware/authorization");
const uiService = require("../services/UIService");
const { DataNotFound, InvalidRequest } = require("../errors");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /ui/menu/header?a=true|false
router.get(
  "/menu/header",
  asyncHandler(async (req, res) => {
    const all = req.query.a === "true";
    const menus = await uiService.getHeaderMenus(all);
    res.json({ status: 200, data: menus });
  })
);

// GET /ui/home
router.get(
  "/home",
  asyncHandler(async (req, res) => {
    const sections = await uiService.getHomePageSections();
    res.json({ status: 200, data: sections });
  })
);

// GET /ui/social
router.get(
  "/social",
  asyncHandler(async (req, res) => {
    const posts = await uiService.getSocialMediaPosts();
    res.json(posts);
  })
);

// GET /ui/menu/footer
router.get(
  "/menu/footer",
  asyncHandler(async (req, res) => {
    const menus = await uiService.getFooterMenus(false);
    res.json({ status: 200, data: menus });
  })
);

// GET /ui/carousel
router.get(
  "/carousel",
  asyncHandler(async (req, res) => {
    const carousels = await uiService.getCarousel();
    res.json({ status: 200, data: carousels });
  })
);

// GET /ui/imageLinks
router.get(
  "/imageLinks",
  asyncHandler(async (req, res) => {
    const imageLinks = await uiService.getAllImageLinks();
    res.json({ status: 200, data: imageLinks });
  })
);

// GET /ui/imageLinks/folder?f=folderName
router.get(
  "/imageLinks/folder",
  asyncHandler(async (req, res) => {
    const folderName = req.query.f;
    if (!folderName)
      throw new InvalidRequest('Folder query parameter "f" is required');
    const links = await uiService.getImageLinksByFolder(folderName);
    res.json({ status: 200, data: links });
  })
);

// Menu create/update/delete routes

router.post(
  "/menu/create",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body; // Validate in service or middleware
    const result = await uiService.createMenu(request);
    res.json({ status: 200, data: result });
  })
);

router.post(
  "/menu/update",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const result = await uiService.updateMenu(request);
    res.json({ status: 200, data: result });
  })
);

router.get(
  "/menu/delete",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const menuId = parseInt(req.query.id, 10);
    if (!menuId) throw new DataNotFound("Menu ID is required");
    const result = await uiService.deleteMenu(menuId);
    res.json({ status: 200, data: result });
  })
);

// Home sections routes

router.get(
  "/home/sections",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const sections = await uiService.getHomePageSections();
    res.json({ status: 200, data: sections });
  })
);

router.get(
  "/home/section/order",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const sectionId = parseInt(req.query.id, 10);
    const priority = parseInt(req.query.p, 10);
    if (!sectionId || priority === undefined)
      throw new DataNotFound("Section ID and priority are required");
    const result = await uiService.setHPSPriority(priority, sectionId);
    res.json({ status: 200, data: result });
  })
);

router.post(
  "/home/section/create",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const result = await uiService.createHomePageSection(request);
    res.json({ status: 200, data: result });
  })
);

router.post(
  "/home/section/update",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const result = await uiService.updateHomePageSection(request);
    res.json({ status: 200, data: result });
  })
);

router.get(
  "/home/section/delete",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const sectionId = parseInt(req.query.id, 10);
    if (!sectionId) throw new DataNotFound("Section ID is required");
    const result = await uiService.deleteHomePageSection(sectionId);
    res.json({ status: 200, data: result });
  })
);

// Social media posts management

router.get(
  "/social/posts",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const posts = await uiService.getSocialMediaPosts();
    res.json({ status: 200, data: posts });
  })
);

// For multipart parsing in create/update social post routes:

router.post(
  "/social/post/create",
  authorizedAdmin,
  upload.fields([{ name: "file" }, { name: "video", maxCount: 1 }]),
  asyncHandler(async (req, res) => {
    const formFields = req.body;
    const files = req.files;
    if (!files || !files.file) throw new InvalidRequest("File is required");

    const contentType = formFields.contentType;
    if (!contentType) throw new InvalidRequest("Content type is required");

    const request = {
      file: files.file[0],
      video: files.video ? files.video[0] : null,
      contentType,
      targetLink: formFields.targetLink,
      title: formFields.title,
      description: formFields.description,
    };

    const result = await uiService.createSocialMediaPost(request);
    res.json({ status: 200, data: result });
  })
);

router.post(
  "/social/post/update",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const result = await uiService.updateSocialMediaPost(request);
    res.json({ status: 200, data: result });
  })
);

router.get(
  "/social/post/delete",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.query.id, 10);
    if (!postId) throw new DataNotFound("Post ID is required");
    const result = await uiService.deleteSocialMediaPost(postId);
    res.json({ status: 200, data: result });
  })
);

// Carousel management

router.get(
  "/carousel/delete",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.query.id, 10);
    if (!postId) throw new DataNotFound("Carousel ID is required");
    const result = await uiService.deleteCarousel(postId);
    res.json({ status: 200, data: result });
  })
);

router.post(
  "/carousel/create",
  authorizedAdmin,
  upload.fields([{ name: "portrait" }, { name: "landscape" }]),
  asyncHandler(async (req, res) => {
    const formFields = req.body;
    const files = req.files;

    const link = formFields.link;
    if (!link) throw new InvalidRequest("Link is required");

    const portrait = files.portrait ? files.portrait[0] : null;
    const landscape = files.landscape ? files.landscape[0] : null;

    if (!portrait || !landscape)
      throw new InvalidRequest(
        "Both portrait and landscape images are required"
      );

    const request = { portrait, landscape, link };

    const result = await uiService.createCarousel(request);
    res.json({ status: 200, data: result });
  })
);

// Image links management

router.post(
  "/imageLinks/create",
  authorizedAdmin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const formFields = req.body;
    const file = req.file;

    if (!file) throw new InvalidRequest("Image file is required");
    if (
      !formFields.name ||
      !formFields.folder ||
      !formFields.type ||
      !formFields.link
    )
      throw new InvalidRequest("Missing required fields");

    const request = {
      name: formFields.name,
      image: file,
      type: parseInt(formFields.type, 10),
      folder: formFields.folder,
      link: formFields.link,
    };

    const result = await uiService.createImageLink(request);
    res.json({ status: 200, data: result });
  })
);

router.get(
  "/imageLinks/delete",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.query.id, 10);
    if (!postId) throw new DataNotFound("ImageLink ID is required");
    const result = await uiService.deleteImageLink(postId);
    res.json({ status: 200, data: result });
  })
);

router.get(
  "/imageLinks/order",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const sectionId = parseInt(req.query.id, 10);
    const priority = parseInt(req.query.p, 10);
    const groupName = req.query.g;

    if (!sectionId || priority === undefined || !groupName)
      throw new DataNotFound("id, p and g query parameters are required");

    const result = await uiService.setImageLink(priority, groupName, sectionId);
    res.json({ status: 200, data: result });
  })
);

module.exports = router;
