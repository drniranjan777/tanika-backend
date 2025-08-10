const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { runTransaction } = require("../config/dbTransactionManager");
const { Cart, Products, SizeOption } = require("../models");

class CartRepository {
  // Check if item in cart by userID, sizeID, productID
  async ifItemInCartByUser(userID, sizeID, productID) {
    return runTransaction(sequelize, async (transaction) => {
      const item = await Cart.findOne({
        where: {
          productId: productID,
          userID,
          sizeId: sizeID,
        },
        transaction,
      });
      if (!item) return null;
      return [item.id, item.quantity];
    });
  }

  // Check if item in cart by deviceID, sizeID, productID
  async ifItemInCartByDevice(deviceID, sizeID, productID) {
    return runTransaction(sequelize, async (transaction) => {
      const item = await Cart.findOne({
        where: {
          productId: productID,
          deviceID,
          sizeId: sizeID,
        },
        transaction,
      });
      if (!item) return null;
      return [item.id, item.quantity];
    });
  }

  // Check if item in cart by userID and cartId
  async ifItemInCartByUserAndCartId(userID, cartId) {
    return runTransaction(sequelize, async (transaction) => {
      const item = await Cart.findOne({
        where: {
          id: cartId,
          userID,
        },
        transaction,
      });
      if (!item) return null;
      return [item.id, item.quantity];
    });
  }

  // Check if item in cart by deviceID and cartId
  async ifItemInCartByDeviceAndCartId(deviceID, cartId) {
    return runTransaction(sequelize, async (transaction) => {
      const item = await Cart.findOne({
        where: {
          id: cartId,
          deviceID,
        },
        transaction,
      });
      if (!item) return null;
      return [item.id, item.quantity];
    });
  }

  // Transfer cart from anonymous deviceID to userID
  async transferCart(deviceID, userID) {
    return runTransaction(sequelize, async (transaction) => {
      const [updated] = await Cart.update(
        { userID },
        {
          where: {
            deviceID,
            userID: null,
          },
          transaction,
        }
      );
      return updated > 0;
    });
  }

  // Delete all cart items by deviceID
  async deleteAllByDevice(deviceID) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await Cart.destroy({
        where: { deviceID },
        transaction,
      });
      return deleted > 0;
    });
  }

  // Delete all cart items by userID
  async deleteAllByUser(userID) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await Cart.destroy({
        where: { userID },
        transaction,
      });
      return deleted > 0;
    });
  }

  // Insert new item for deviceID cart
  async insertItemByDevice(deviceID, sizeID, productID, quantity) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await Cart.create(
        {
          deviceID,
          sizeId: sizeID,
          productId: productID,
          quantity,
        },
        { transaction }
      );
      return created.id;
    });
  }

  // Insert new item for userID cart
  async insertItemByUser(userID, sizeID, productID, quantity) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await Cart.create(
        {
          userID,
          sizeId: sizeID,
          productId: productID,
          quantity,
        },
        { transaction }
      );
      return created.id;
    });
  }

  // Update quantity by itemID and userID
  async updateQuantityByUser(itemID, quantity, userID) {
    return runTransaction(sequelize, async (transaction) => {
      const [updated] = await Cart.update(
        { quantity },
        {
          where: {
            id: itemID,
            userID,
          },
          transaction,
        }
      );
      return updated;
    });
  }

  // Update quantity by itemID and deviceID
  async updateQuantityByDevice(itemID, quantity, deviceID) {
    return runTransaction(sequelize, async (transaction) => {
      const [updated] = await Cart.update(
        { quantity },
        {
          where: {
            id: itemID,
            deviceID,
          },
          transaction,
        }
      );
      return updated;
    });
  }

  // Delete item by itemID and userID
  async deleteItemByUser(itemID, userID) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await Cart.destroy({
        where: { id: itemID, userID },
        transaction,
      });
      return deleted;
    });
  }

  // Delete item by itemID and deviceID
  async deleteItemByDevice(itemID, deviceID) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await Cart.destroy({
        where: { id: itemID, deviceID },
        transaction,
      });
      return deleted;
    });
  }

  // Get all cart items for a user, including product and size details
  async getAllItemsByUser(userID) {
    return runTransaction(sequelize, async (transaction) => {
      const items = await Cart.findAll({
        where: { userID },
        include: [
          {
            model: Products,
            required: true,
          },
          {
            model: SizeOption,
            required: true,
          },
        ],
        transaction,
      });

      // Optionally, map each to plain JS object or CartItem DTO here
      return items;
    });
  }

  // Get all cart items for a deviceID including product and size details
  async getAllItemsByDevice(deviceID) {
    return runTransaction(sequelize, async (transaction) => {
      const items = await Cart.findAll({
        where: { deviceID },
        include: [
          {
            model: Products,
            required: true,
          },
          {
            model: SizeOption,
            required: true,
          },
        ],
        transaction,
      });

      return items;
    });
  }

  // Get total cart quantity count for a deviceID (sum of quantities)
  async getCartCountByDevice(deviceID) {
    return runTransaction(sequelize, async (transaction) => {
      const result = await Cart.findAll({
        where: { deviceID },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        ],
        raw: true,
        transaction,
      });
      return Number(result[0].totalQuantity) || 0;
    });
  }

  // Get total cart quantity count for a userID (sum of quantities)
  async getCartCountByUser(userID) {
    return runTransaction(sequelize, async (transaction) => {
      const result = await Cart.findAll({
        where: { userID },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        ],
        raw: true,
        transaction,
      });
      return Number(result[0].totalQuantity) || 0;
    });
  }
}

module.exports = new CartRepository();
