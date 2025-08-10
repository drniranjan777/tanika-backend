class PagingUtils {
  /**
   *
   * @param {number} perPage - Number of items per page
   */
  constructor(perPage) {
    this.perPage = perPage;
  }

  /**
   * Converts 1-based page number to zero-based offset
   * @param {number} page
   * @returns {number}
   */
  toOffset(page) {
    return (page - 1) * this.perPage;
  }

  /**
   * Creates a pagination result object
   * @param {number} itemCount - total number of items
   * @param {Array} data - the current page items
   * @returns {object} pagination data
   */
  create(itemCount, data) {
    return {
      totalCount: itemCount,
      perPage: this.perPage,
      data,
      totalPages: Math.ceil(itemCount / this.perPage),
      currentPage: Math.floor(this.toOffset(1) / this.perPage) + 1, // optionally set currentPage elsewhere
    };
  }
}

module.exports = PagingUtils;
