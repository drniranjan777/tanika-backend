const Joi = require("joi");

const createAddressSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  pincode: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});

const updateAddressSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  pincode: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});

function validateCreateAddress(data) {
  return createAddressSchema.validate(data);
}

function validateUpdateAddress(data) {
  return updateAddressSchema.validate(data);
}

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
