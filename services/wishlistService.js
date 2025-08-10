class WishlistService {
  /**
   * @param {Object} options
   * @param {Object} options.wishlistRepository - repository instance with async DB methods
   * @param {Object} options.pageUtils - paging utility with toOffset and create methods
   */
  constructor({ wishlistRepository, pageUtils }) {
    this.wishlistRepository = wishlistRepository;
    this.pageUtils = pageUtils;
  }

  async getProducts(userId, deviceId, pageNo) {
    const offset = this.pageUtils.toOffset(pageNo);
    const itemCount = await this.wishlistRepository.getProductsCount(
      userId,
      deviceId
    );
    const data = await this.wishlistRepository.getProducts(
      userId,
      deviceId,
      offset
    );
    return this.pageUtils.create(itemCount, data);
  }

  async addItem(userId, deviceId, productId) {
    const exists = await this.wishlistRepository.exists(
      userId,
      deviceId,
      productId
    );
    if (exists) {
      return { status: true };
    }
    const resultId = await this.wishlistRepository.insertWishlist(
      userId,
      deviceId,
      productId
    );
    return { status: resultId > 0 };
  }

  async removeItem(userId, deviceId, id) {
    const exists = await this.wishlistRepository.exists(id);
    if (!exists) {
      return { status: true };
    }
    const deleted = await this.wishlistRepository.deleteWishlist(id);
    return { status: deleted };
  }

  async inWishlist(productId, deviceId, userId) {
    const exists = await this.wishlistRepository.exists(
      userId,
      deviceId,
      productId
    );
    return { status: exists };
  }
}

module.exports = WishlistService;
