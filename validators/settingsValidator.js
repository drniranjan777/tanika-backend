const Joi = require("joi");

// Example schema for SettingsItem, adapt fields as per your model
const settingsItemSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives()
    .try(Joi.string(), Joi.number(), Joi.boolean())
    .required(),
  // add other fields if present
});

// Full request schema that wraps the settings item
const settingsRequestSchema = Joi.object({
  settings: settingsItemSchema.required(),
});

/**
 * Validates SettingsRequest data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws Joi.ValidationError
 */
function validateSettingsRequest(data) {
  return settingsRequestSchema.validateAsync(data);
}

module.exports = {
  validateSettingsRequest,
};
