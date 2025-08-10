const express = require("express");
const router = express.Router();
const testimonialService = require("../services/testimonialService");
const { authorizedAdmin } = require("../middleware/authorization");
const asyncHandler = require("express-async-handler");


router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await testimonialService.getTestimonials();
    res.json({ status: 200, data });
  })
);

router.get(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const data = await testimonialService.getTestimonialById(req.params.id);
    res.json({ status: 200, data });
  })
);


router.post(
  "/",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const created = await testimonialService.addTestimonial(request);
    res.json({ status: 200, data: created });
  })
);


router.put(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const request = req.body;
    const created = await testimonialService.editTestimonial(req.params.id,request);
    res.json({ status: 200, data: created });
  })
);


router.delete(
  "/:id",
  authorizedAdmin,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const removed = await testimonialService.deleteTestimonial(id);
    res.json({ status: 200, data: removed });
  })
);

module.exports = router;
