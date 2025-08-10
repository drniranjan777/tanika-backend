const Joi = require("joi");

const OrderStatus = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const changeOrderSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  status: Joi.string()
    .valid(...OrderStatus)
    .required(),
});

const confirmOrderSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  orderCreationId: Joi.string().trim().required(),
  razorpayPaymentId: Joi.string().trim().required(),
  razorpayOrderId: Joi.string().trim().required(),
  razorpaySignature: Joi.string().trim().required(),
});

const createOrderSchema = Joi.object({
  billingAddress: Joi.string().trim().required(),
  shippingAddress: Joi.string().trim().required(),
  billingName: Joi.string().trim().required(),
  shippingName: Joi.string().trim().required(),
  billingMobile: Joi.string().trim().required(),
  shippingMobile: Joi.string().trim().required(),
  additionalComments: Joi.string().trim().allow(null, ""),
});

const orderCreateSchema = Joi.object({
  billingAddress: Joi.string().trim().required(),
  shippingAddress: Joi.string().trim().required(),
  additionalComments: Joi.string().allow(null, "").optional(),
  orderStatus: Joi.string()
    .valid(...OrderStatus)
    .required(),
});

async function validateChangeOrder(data) {
  const { error, value } = changeOrderSchema.validate(data);
  if (error) throw new Error(`Invalid ChangeOrderRequest: ${error.message}`);
  return value;
}

async function validateConfirmOrder(data) {
  const { error, value } = confirmOrderSchema.validate(data);
  if (error) throw new Error(`Invalid ConfirmOrderRequest: ${error.message}`);
  return value;
}

async function validateCreateOrder(data) {
  const { error, value } = createOrderSchema.validate(data);
  if (error) throw new Error(`Invalid CreateOrderRequest: ${error.message}`);
  return value;
}

async function validateOrderCreateRequest(data) {
  return orderCreateSchema.validateAsync(data);
}

module.exports = {
  OrderStatus,

  validateChangeOrder,
  validateConfirmOrder,
  validateCreateOrder,
  changeOrderSchema,
  confirmOrderSchema,
  createOrderSchema,

  validateOrderCreateRequest,
  orderCreateSchema,
};
