const Joi = require("joi");

// Validation schema for LoginRequest
const loginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required(),
  deviceID: Joi.string().min(10).max(64).required(),
});

// Validation schema for LoginRefreshRequest
const loginRefreshRequestSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  rToken: Joi.string().min(32).required(),
  deviceID: Joi.string().min(10).max(64).required(),
});

// AdminChangePasswordRequest
const adminChangePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().min(8).max(25).required(), // Assuming password rules same as before
});

// AdminForgotPasswordResetRequest
const adminForgotPasswordResetSchema = Joi.object({
  password: Joi.string().min(8).max(25).required(),
  tokenID: Joi.number().integer().required(),
});

// AdminForgotPasswordRequest
const adminForgotPasswordSchema = Joi.object({
  username: Joi.string().required(),
});

// AdminLoginRequest
const adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// AdminRegisterRequest
const adminRegisterSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  isActive: Joi.boolean().required(),
});
