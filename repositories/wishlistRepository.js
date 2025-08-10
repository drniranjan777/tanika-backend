const { Op } = require("sequelize");
const { Wishlist, Product } = require("../models"); // Adjust according to your model exports

class WishlistRepository {
  constructor(perPage) {
    this.perPage = perPage;
  }

  // Fetch wishlist products for userId or deviceId (with pagination)
  async getProducts(userId, deviceId, offset = 0) {
    const whereClause = {};
    if (userId != null) {
      whereClause.userID = userId;
    } else if (deviceId != null) {
      whereClause.deviceID = deviceId;
    } else {
      // No userId or deviceId passed — return empty or throw error as appropriate
      return [];
    }

    const wishlistItems = await Wishlist.findAll({
      where: whereClause,
      include: [{ model: Product }],
      offset,
      limit: this.perPage,
    });

    // Map Sequelize instances to Product items (assuming Product data is needed)
    return wishlistItems.map((wish) => wish.Product); // or convert to domain model as needed
  }

  // Count wishlist products for userId or deviceId
  async getProductsCount(userId, deviceId) {
    const whereClause = {};
    if (userId != null) {
      whereClause.userID = userId;
    } else if (deviceId != null) {
      whereClause.deviceID = deviceId;
    } else {
      return 0;
    }

    return Wishlist.count({ where: whereClause });
  }

  // Check existence by userId/deviceId and productId
  async existsByUserOrDevice(userId, deviceId, productId) {
    if (userId == null && deviceId == null) return false;

    const whereClause = {
      productID: productId,
    };
    if (userId != null) {
      whereClause.userID = userId;
    } else {
      whereClause.deviceID = deviceId;
    }

    const count = await Wishlist.count({ where: whereClause });
    return count > 0;
  }

  // Check existence by wishlist id
  async existsById(id) {
    const count = await Wishlist.count({ where: { id } });
    return count > 0;
  }

  // Insert new wishlist item
  async insertWishlist(userId, deviceId, productId) {
    const newEntry = await Wishlist.create({
      userID: userId,
      deviceID: deviceId,
      productID: productId,
    });
    return newEntry.id;
  }

  // Delete wishlist entry by id
  async deleteWishlist(wishListId) {
    const deletedCount = await Wishlist.destroy({ where: { id: wishListId } });
    return deletedCount > 0;
  }
}

module.exports = WishlistRepository;
