const Joi = require("joi");

const createImageLinkSchema = Joi.object({
  name: Joi.string().trim().required(),
  // 'image' is a file and is checked in the route, not in Joi
  type: Joi.number().integer().required(),
  folder: Joi.string().trim().required(),
  link: Joi.string().trim().required(),
});

/**
 * Validates the CreateImageLinkRequest (excluding image file)
 */
function validateCreateImageLink(data) {
  return createImageLinkSchema.validateAsync(data);
}

module.exports = { validateCreateImageLink };
