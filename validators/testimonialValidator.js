const Joi = require("joi");

const createTestimonialSchema = Joi.object({
  name: Joi.string().trim().required(),
  rating: Joi.number().integer().positive().required(),
  testimonial: Joi.string().trim().required(),
});


function validateCreateTestimonial(data) {
  return createTestimonialSchema.validate(data);
}


module.exports = {
   validateCreateTestimonial
}