const Joi = require("joi");

// Validation schema for CreatePageRequest
const createPageSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow(null, "").optional(),
  content: Joi.string().allow(null, "").optional(),
  isPublished: Joi.boolean().required(),
});

// Validation schema for UpdatePageRequest
const updatePageSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().allow(null, "").optional(),
  content: Joi.string().allow(null, "").optional(),
  isPublished: Joi.boolean().required(),
});

/**
 * Validate CreatePageRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws Joi.ValidationError
 */
function validateCreatePage(data) {
  return createPageSchema.validateAsync(data);
}

/**
 * Validate UpdatePageRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws Joi.ValidationError
 */
function validateUpdatePage(data) {
  return updatePageSchema.validateAsync(data);
}

module.exports = {
  validateCreatePage,
  validateUpdatePage,
};
