const express = require("express");
const router = express.Router();
const homepageGridService = require("../services/homepageGridService");
const asyncHandler = require("express-async-handler");
const { authorizedAdmin } = require("../middleware/authorization");
const { upload, parseMultipartForm } = require("../utils/parseMultipart");


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

// router.post(
//   "/",
//   // authorizedAdmin,
//   asyncHandler(async (req, res) => {
//     const created = await homepageGridService.addItem(req.body);
//     res.json({ status: 200,message:"Created Successfull", data: created });
//   })
// );

router.post(
  "/",
  authorizedAdmin,
  upload.any(),  // multer populates req.files and req.body
  asyncHandler(async (req, res) => {
    const fields = req.body;
    const files = req.files;
    console.log(fields,'.....')

    const fileMap = {};
    for (const file of files) {
      fileMap[file.fieldname] = `/uploads/${file.filename}`;
    }

    const dataToSave = {
      ...fields,
      image1Url: fileMap["image1"] || null,
      image2Url: fileMap["image2"] || null,
      videoUrl: fileMap["video"] || null,
    };

    // console.log(dataToSave, "dataa.............");
   const created = await homepageGridService.addItem(dataToSave);

    res.json({
      status: 200,
      message: "Created Successfully",
      data: created,
    });
  })
)



// router.put(
//   "/:id",
//   // authorizedAdmin,
//   asyncHandler(async (req, res) => {
//     const updated = await homepageGridService.updateItem(req.params.id, req.body);
//     res.json({ status: 200, data: updated });
//   })
// );

router.put(
  "/:id",
  authorizedAdmin,
  upload.any(), // multer middleware to parse multipart/form-data (files + fields)
  asyncHandler(async (req, res) => {
    const fields = req.body;    // text fields
    const files = req.files;    // uploaded files

    // Map uploaded files field names to URLs/paths
    const fileMap = {};
    for (const file of files) {
      fileMap[file.fieldname] = `/uploads/${file.filename}`; // or however you construct URL/path
    }

    // Merge files and fields into one object to pass to service
    const dataToUpdate = {
      ...fields,
      image1: fileMap["image1"] || undefined,  // use undefined if no file uploaded to keep existing
      image2: fileMap["image2"] || undefined,
      video: fileMap["video"] || undefined,
    };

    const updated = await homepageGridService.updateItem(req.params.id, dataToUpdate);
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
