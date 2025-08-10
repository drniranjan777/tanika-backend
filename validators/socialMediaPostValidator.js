const Joi = require("joi");

// Define your content type enum values as strings here
const SocialMediaPostContentTypes = ["IMAGE", "VIDEO", "TEXT", "LINK"]; // example values; replace with your actual enum keys

// Schema for CreateSocialMediaPostRequest
const createSocialMediaPostSchema = Joi.object({
  // file and video would be files handled by multer; here only validate presence of file key
  file: Joi.object().required(), // Assuming multer file object with details; adjust as needed
  video: Joi.object().optional().allow(null),
  contentType: Joi.string()
    .valid(...SocialMediaPostContentTypes)
    .required(),
  targetLink: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

// Schema for UpdateSocialMediaPostRequest
const updateSocialMediaPostSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  file: Joi.object().optional().allow(null),
  video: Joi.object().optional().allow(null),
  contentType: Joi.string()
    .valid(...SocialMediaPostContentTypes)
    .required(),
  targetLink: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

/**
 * Validate create social media post request
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function validateCreateSocialMediaPost(data) {
  // Validate presence of file as part of multer file object
  if (!data.file) {
    throw new Error("File is required");
  }
  return createSocialMediaPostSchema.validateAsync(data);
}

/**
 * Validate update social media post request
 * @param {Object} data
 * @returns {Promise<Object>}
 */
function validateUpdateSocialMediaPost(data) {
  return updateSocialMediaPostSchema.validateAsync(data);
}

module.exports = {
  validateCreateSocialMediaPost,
  validateUpdateSocialMediaPost,
  SocialMediaPostContentTypes,
};
