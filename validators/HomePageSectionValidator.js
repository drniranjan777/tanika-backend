const Joi = require("joi");

// Import or define your HomePageSectionType enum keys here, e.g.:
const HomePageSectionType = ["TYPE1", "TYPE2", "TYPE3"]; // replace these with your actual values

// Schema for the CreateHomePageSectionRequest
const createHomePageSectionSchema = Joi.object({
  type: Joi.string()
    .valid(...HomePageSectionType)
    .required(),
  title: Joi.string().trim().required(),
  payload: Joi.string().allow(null, "").optional(),
  priority: Joi.number().integer().positive().required(),
});

// Schema for the UpdateHomePageSectionRequest
const updateHomePageSectionSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  type: Joi.string()
    .valid(...HomePageSectionType)
    .required(),
  title: Joi.string().trim().required(),
  payload: Joi.string().allow(null, "").optional(),
  priority: Joi.number().integer().positive().required(),
});

/**
 * Validate create home page section request
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateCreateHomePageSection(data) {
  return createHomePageSectionSchema.validateAsync(data);
}

/**
 * Validate update home page section request
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateUpdateHomePageSection(data) {
  return updateHomePageSectionSchema.validateAsync(data);
}

module.exports = {
  validateCreateHomePageSection,
  validateUpdateHomePageSection,
};
