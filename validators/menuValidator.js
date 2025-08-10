const Joi = require("joi");

// Assuming you have enums or allowed strings for MenuType and Location, e.g.:
const MenuTypeValues = ["TYPE1", "TYPE2", "TYPE3"]; // replace with actual keys
const LocationValues = ["LOCATION1", "LOCATION2", "LOCATION3"]; // replace with actual keys

// CreateMenuRequest validation schema
const createMenuSchema = Joi.object({
  type: Joi.string()
    .valid(...MenuTypeValues)
    .required(),
  display: Joi.string().trim().required(),
  payload: Joi.string().allow(null, "").optional(),
  location: Joi.string()
    .valid(...LocationValues)
    .required(),
  parent: Joi.number().integer().positive().allow(null).optional(),
  visible: Joi.boolean().required(),
  sectionHeader: Joi.string().allow(null, "").optional(),
});

// UpdateMenuRequest validation schema
const updateMenuSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  type: Joi.string()
    .valid(...MenuTypeValues)
    .required(),
  display: Joi.string().trim().required(),
  payload: Joi.string().allow(null, "").optional(),
  location: Joi.string()
    .valid(...LocationValues)
    .required(),
  parent: Joi.number().integer().positive().allow(null).optional(),
  visible: Joi.boolean().required(),
  sectionHeader: Joi.string().allow(null, "").optional(),
});

/**
 * Validate create menu data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateCreateMenu(data) {
  return createMenuSchema.validateAsync(data);
}

/**
 * Validate update menu data
 * @param {Object} data
 * @returns {Promise<Object>} validated data or throws ValidationError
 */
function validateUpdateMenu(data) {
  return updateMenuSchema.validateAsync(data);
}

module.exports = {
  validateCreateMenu,
  validateUpdateMenu,
};
