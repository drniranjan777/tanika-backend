const DataNotFound = require("../errors"); // your custom error
const Status = require("../models/common/Status"); // or simply use { status: true/false }
const cartRepository = require("../repositories/cartRepository");

class CartService {
  /**
   * Get cart items and summary by deviceId or userId
   * @param {string|null} deviceId
   * @param {number|null} userId
   * @returns {Promise<{total: number, items: Array, count: number}>}
   */
  async getItems(deviceId, userId) {
    let items = [];
    let cartCount = 0;

    if (deviceId) {
      items = await cartRepository.getAllItemsByDevice(deviceId);
      cartCount = await cartRepository.getCartCountByDevice(deviceId);
    } else if (userId) {
      items = await cartRepository.getAllItemsByUser(userId);
      cartCount = await cartRepository.getCartCountByUser(userId);
    }

    // Calculate total price (assuming price is in product object on item)
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      total,
      items,
      count: cartCount,
    };
  }

  /**
   * Add item to cart by deviceId or userId
   * @param {string|null} deviceId
   * @param {number|null} userId
   * @param {number} productId
   * @param {number} sizeId
   * @param {number} qty
   * @returns {Promise<Status>}
   */
  async addItem(deviceId, userId, productId, sizeId, qty) {
    if (deviceId) {
      const cartItem = await cartRepository.ifItemInCartByDevice(
        deviceId,
        sizeId,
        productId
      );
      if (cartItem) {
        const [cartID, previousQuantity] = cartItem;
        await cartRepository.updateQuantityByDevice(
          cartID,
          previousQuantity + qty,
          deviceId
        );
        return new Status(cartID > 0);
      } else {
        const cartID = await cartRepository.insertItemByDevice(
          deviceId,
          sizeId,
          productId,
          qty
        );
        return new Status(cartID > 0);
      }
    } else if (userId) {
      const cartItem = await cartRepository.ifItemInCartByUser(
        userId,
        sizeId,
        productId
      );
      if (cartItem) {
        const [cartID, previousQuantity] = cartItem;
        await cartRepository.updateQuantityByUser(
          cartID,
          previousQuantity + qty,
          userId
        );
        return new Status(cartID > 0);
      } else {
        const cartID = await cartRepository.insertItemByUser(
          userId,
          sizeId,
          productId,
          qty
        );
        return new Status(cartID > 0);
      }
    }
    return new Status(false);
  }

  /**
   * Delete item in cart by deviceId or userId
   * @param {string|null} deviceId
   * @param {number|null} userId
   * @param {number} cartID
   * @returns {Promise<Status>}
   */
  async deleteItem(deviceId, userId, cartID) {
    let result = false;
    if (deviceId) {
      result = (await cartRepository.deleteItemByDevice(cartID, deviceId)) > 0;
    } else if (userId) {
      result = (await cartRepository.deleteItemByUser(cartID, userId)) > 0;
    }
    return new Status(result);
  }

  /**
   * Empty cart by deviceId or userId
   * @param {string|null} deviceId
   * @param {number|null} userId
   * @returns {Promise<Status>}
   */
  async emptyCart(deviceId, userId) {
    let result = false;
    if (deviceId) {
      result = await cartRepository.deleteAllByDevice(deviceId);
    } else if (userId) {
      result = await cartRepository.deleteAllByUser(userId);
    }
    return new Status(result);
  }

  /**
   * Update cart item quantity by deviceId or userId
   * @param {string|null} deviceId
   * @param {number|null} userId
   * @param {number} cartId
   * @param {number} qty
   * @returns {Promise<Status>}
   * @throws {DataNotFound} if cart item not found
   */
  async updateQty(deviceId, userId, cartId, qty) {
    let cartItem;
    if (deviceId) {
      cartItem = await cartRepository.ifItemInCartByDeviceAndCartId(
        deviceId,
        cartId
      );
    } else if (userId) {
      cartItem = await cartRepository.ifItemInCartByUserAndCartId(
        userId,
        cartId
      );
    }

    if (!cartItem) throw new DataNotFound("Cart item not found");

    const [id, prevQty] = cartItem;

    if (prevQty === qty) {
      return new Status(true); // No change needed
    }

    let updateCount = 0;
    if (deviceId) {
      updateCount = await cartRepository.updateQuantityByDevice(
        id,
        qty,
        deviceId
      );
    } else if (userId) {
      updateCount = await cartRepository.updateQuantityByUser(id, qty, userId);
    }

    return new Status(updateCount > 0);
  }
}

module.exports = new CartService();
