// utils/parseMultipart.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure tempUploads folder exists
const tempUploads = path.resolve(__dirname, "../temp/uploads");
if (!fs.existsSync(tempUploads)) fs.mkdirSync(tempUploads, { recursive: true });

// Storage strategy to match Ktor's behavior
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploads);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/**
 * Express middleware for multipart parsing (fields + files)
 * Usage: router.post('/route', upload.any(), parseMultipartForm, handler)
 */
async function parseMultipartForm(req, res, next) {
  try {
    // Collect fields
    const formFields = { ...req.body };
    // Collect files (fieldname: file info)
    const files = {};
    if (req.files) {
      for (const file of req.files) {
        files[file.fieldname] = file; // include path, filename, mimetype, etc.
      }
    }
    req.formFields = formFields;
    req.files = files;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  upload, // to use as middleware in route
  parseMultipartForm, // to use after upload.any() in route
};
