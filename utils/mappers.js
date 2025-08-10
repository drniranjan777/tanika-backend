/**
 * Maps a Sequelize User model instance to plain User object
 * @param {import('../models').User} userInstance
 * @returns {Object} plain user object
 */
function toUser(userInstance) {
  if (!userInstance) return null;
  return {
    id: userInstance.id,
    accountStatus: userInstance.accountStatus,
    name: userInstance.name,
    phoneNumber: userInstance.phoneNumber,
  };
}

/**
 * Maps a Sequelize OTPTries instance to OTPTryRecord-like object
 * @param {import('../models').OTPTries} otpTryInstance
 * @returns {Object} OTP try record
 */
function toOTPTryRecord(otpTryInstance) {
  if (!otpTryInstance) return null;
  return {
    date: otpTryInstance.lastUpdated, // Sequelize DATE fields are JS Date objects already
    mobile: otpTryInstance.mobileNumber,
    tries: otpTryInstance.tries,
  };
}

// utils/mappers.js or repositories/cartRepository.js (wherever appropriate)

function toCartItem(cartInstance) {
  if (!cartInstance) return null;
  return {
    id: cartInstance.id,
    quantity: cartInstance.quantity,
    product: toProductItem(cartInstance.Product), // assuming .Product included
    size: toSizeOption(cartInstance.SizeOption), // assuming .SizeOption included
  };
}

// You need to implement similarly:
function toProductItem(productInstance) {
  if (!productInstance) return null;
  return {
    // map fields needed by your CartItem.product from productInstance
    id: productInstance.id,
    name: productInstance.name,
    // ... other fields from your Product model
  };
}

function toSizeOption(sizeOptionInstance) {
  if (!sizeOptionInstance) return null;
  return {
    // map fields needed by your CartItem.size from sizeOptionInstance
    id: sizeOptionInstance.id,
    label: sizeOptionInstance.label,
    // ... other size option fields
  };
}

function getFinalPrice(price, discount) {
  if (discount > 0) {
    return Math.ceil(price - price * (discount / 100));
  }
  return Math.ceil(price);
}

function mapProductItem(dbRow) {
  return {
    id: dbRow.id,
    name: dbRow.name,
    description: dbRow.description,
    previews: dbRow.screens ? JSON.parse(dbRow.screens).map((f) => f.url) : [],
    thumbnail: dbRow.thumbnail ? JSON.parse(dbRow.thumbnail).url : "",
    visibility: dbRow.visibility,
    price: getFinalPrice(dbRow.price, dbRow.discount),
    discount: dbRow.discount,
    isFeatured: dbRow.isFeatured,
    ordered: dbRow.orderedTimes,
    url: dbRow.vanityUrl,
    rawPrice: dbRow.price,
  };
}

// Example conversion function from database row/object to domain model in JS

function mapToOrderAddress(dbRow) {
  return {
    shippingAddress: dbRow.shippingAddress,
    shippingNumber: dbRow.shippingMobile,
    shippingName: dbRow.shippingName,
  };
}

function mapToOrderItem(dbRow) {
  return {
    id: dbRow.id,
    createdDate: dbRow.createdDate, // assuming JS Date object or parse if string
    orderNo: dbRow.orderNo,
    orderTotal: dbRow.orderTotal,
    discount: dbRow.discount,
    discountType: dbRow.discountType,
    billingAddress: dbRow.billingAddress,
    shippingAddress: dbRow.shippingAddress,
    gatewayOrderID: dbRow.gatewayOrderID,
    additionalComments: dbRow.additionalComments,
    orderStatus: mapOrderStatusFromOrdinal(dbRow.orderStatus), // Your JS equivalent mapping
    lastUpdate: dbRow.lastUpdate,
    userID: dbRow.userID,
    completedTime: dbRow.completedTime || null,
    shippingNumber: dbRow.shippingMobile,
    shippingName: dbRow.shippingName,
    billingNumber: dbRow.billingMobile,
    billingName: dbRow.billingName,
  };
}

function mapMenuLocationFromOrdinal(ordinal) {
  const locations = ["HEADER", "FOOTER", "SIDEBAR"];
  return locations[ordinal] || "HEADER";
}

function mapMenuTypeFromOrdinal(ordinal) {
  const types = ["ITEM", "CATEGORY", "LINK"];
  return types[ordinal] || "LINK";
}

// Example of mapping enum ordinal to JS enum or string status
function mapOrderStatusFromOrdinal(ordinal) {
  const statuses = ["FAILED", "PLACED", "DELIVERED", "CANCELLED"]; // example
  return statuses[ordinal] || "UNKNOWN";
}

module.exports = {
  toUser,
  toOTPTryRecord,
  toCartItem,
  toProductItem,
  toSizeOption,
  getFinalPrice,
  mapProductItem,
  mapToOrderAddress,
  mapToOrderItem,
  mapOrderStatusFromOrdinal,
  mapMenuLocationFromOrdinal,
  mapMenuTypeFromOrdinal,
};
