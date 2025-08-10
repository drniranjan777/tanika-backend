const Joi = require("joi");

// Validation schema for creating a product property
const createProductPropertySchema = Joi.object({
  name: Joi.string().trim().required(),
  value: Joi.string().trim().required(),
});

// Validation schema for editing a product property
const editProductPropertySchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  value: Joi.string().trim().required(),
});

/**
 * Validate CreateProductPropertyRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateCreateProductProperty(data) {
  return createProductPropertySchema.validateAsync(data);
}

/**
 * Validate EditProductPropertyRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateEditProductProperty(data) {
  return editProductPropertySchema.validateAsync(data);
}

module.exports = {
  validateCreateProductProperty,
  validateEditProductProperty,
};
