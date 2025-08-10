const { Address } = require("../models"); // Sequelize Address model
const {
  runTransactionWithSchema,
  runTransaction,
} = require("../utils/config/dbTransactionManager");
// const sequelize = require("../config/database");
const sequelize = require("../utils/config/database");

const PRIMARY_SCHEMA = "public"; // change if multi-schema used

/**
 * Get all addresses for a user
 * @param {number} userId
 * @returns {Promise<Array>}
 */
async function getAddresses(userId) {
  return await runTransaction(sequelize, async (transaction) => {
    return await Address.findAll({
      where: { userId },
      transaction,
    });
  });
}

/**
 * Get address by ID
 * @param {number} addressId
 * @returns {Promise<Object|null>}
 */
async function getAddressById(addressId) {
  return await runTransaction(sequelize, async (transaction) => {
    return await Address.findOne({
      where: { id: addressId },
      transaction,
    });
  });
}

/**
 * Insert new address
 * @param {Object} addressData
 * @param {number} addressData.userId
 * @param {string} addressData.name
 * @param {string} addressData.phone
 * @param {string} addressData.address
 * @param {string} addressData.city
 * @param {string} addressData.state
 * @param {string} addressData.pincode
 * @param {string} addressData.country
 * @returns {Promise<number>} The new Address ID
 */
async function insertAddress(addressData) {
  return await runTransaction(sequelize, async (transaction) => {
    const created = await Address.create(addressData, { transaction });
    return created.id;
  });
}

/**
 * Update an existing address
 * @param {Object} addressData Must include `id`
 * @returns {Promise<boolean>} true if updated, false if no rows affected
 */
async function updateAddress(addressData) {
  return await runTransaction(sequelize, async (transaction) => {
    const [updatedCount] = await Address.update(addressData, {
      where: { id: addressData.id },
      transaction,
    });
    return updatedCount > 0;
  });
}

/**
 * Delete address by ID
 * @param {number} addressId
 * @returns {Promise<boolean>} true if deleted
 */
async function deleteAddress(addressId) {
  return await runTransaction(sequelize, async (transaction) => {
    const deletedCount = await Address.destroy({
      where: { id: addressId },
      transaction,
    });
    return deletedCount > 0;
  });
}

module.exports = {
  getAddresses,
  getAddressById,
  insertAddress,
  updateAddress,
  deleteAddress,
};
