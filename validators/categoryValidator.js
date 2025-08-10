const Joi = require("joi");

// Create Category validation
const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
});

// Edit Category validation
const editCategorySchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  url: Joi.string().trim().required(),
});

/**
 * Validates create category data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateCreateCategory(data) {
  return createCategorySchema.validateAsync(data);
}

/**
 * Validates edit category data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateEditCategory(data) {
  return editCategorySchema.validateAsync(data);
}

module.exports = {
  validateCreateCategory,
  validateEditCategory,
};
