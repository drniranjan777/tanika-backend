const Joi = require("joi");

// For files, Joi cannot validate file presence directly.
// So validate files presence separately in your route handler middleware.
// Here we validate only the 'link' field:

const createCarouselSchema = Joi.object({
  link: Joi.string().trim().required(),
});

/**
 * Validates the create carousel request data (except files)
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws Joi.ValidationError
 */
function validateCreateCarousel(data) {
  return createCarouselSchema.validateAsync(data);
}

module.exports = {
  validateCreateCarousel,
};
