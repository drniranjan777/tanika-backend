const Joi = require("joi");

// Validation schema for CreateSizeOptionRequest
const createSizeOptionSchema = Joi.object({
  name: Joi.string().trim().required(),
  displayName: Joi.string().trim().required(),
});

// Validation schema for EditSizeOptionRequest
const editSizeOptionSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  displayName: Joi.string().trim().required(),
});

/**
 * Validate CreateSizeOptionRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateCreateSizeOption(data) {
  return createSizeOptionSchema.validateAsync(data);
}

/**
 * Validate EditSizeOptionRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateEditSizeOption(data) {
  return editSizeOptionSchema.validateAsync(data);
}

module.exports = {
  validateCreateSizeOption,
  validateEditSizeOption,
};
