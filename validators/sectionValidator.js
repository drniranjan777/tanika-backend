const Joi = require("joi");

// Schema for CreateSectionRequest
const createSectionSchema = Joi.object({
  name: Joi.string().trim().required(),
});

// Schema for EditSectionRequest
const editSectionSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  url: Joi.string().trim().required(),
});

/**
 * Validates create section data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws
 */
function validateCreateSection(data) {
  return createSectionSchema.validateAsync(data);
}

/**
 * Validates edit section data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws
 */
function validateEditSection(data) {
  return editSectionSchema.validateAsync(data);
}

module.exports = {
  validateCreateSection,
  validateEditSection,
};
