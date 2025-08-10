const Joi = require("joi");

// Create Product validation schema
const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  // thumbnail will be a file from multipart, validate presence separately in code
  // screens will be files list, validate outside schema (Joi does not handle files)
  visibility: Joi.boolean().required(),
  price: Joi.number().required(),
  discount: Joi.number().default(0),
  isFeatured: Joi.boolean().required(),
});

// Edit Product validation schema
const editProductSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  // thumbnail and screens optional files, validate presence in route handler if needed
  visibility: Joi.boolean().required(),
  price: Joi.number().required(),
  discount: Joi.number().default(0),
  isFeatured: Joi.boolean().required(),
  removedScreens: Joi.array().items(Joi.string()).default([]),
});

async function validateCreateProduct(data) {
  return createProductSchema.validateAsync(data);
}

async function validateEditProduct(data) {
  return editProductSchema.validateAsync(data);
}

module.exports = {
  validateCreateProduct,
  validateEditProduct,
};
