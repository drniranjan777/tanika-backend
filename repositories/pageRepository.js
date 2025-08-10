const { Op } = require("sequelize");
const { Page } = require("../models"); // Adjust path as per your project structure

class PageRepository {
  constructor(perPage) {
    this.perPage = perPage;
  }

  // Get page by ID
  async getPageById(id) {
    return Page.findOne({ where: { id } });
  }

  // Get page by URL
  async getPageByUrl(url) {
    return Page.findOne({ where: { url } });
  }

  // Get all pages with optional filter for published pages only; paginated by offset and perPage
  async getAllPages(publishedOnly = false, offset = 0) {
    const whereClause = publishedOnly ? { isPublished: true } : {};
    return Page.findAll({
      where: whereClause,
      offset,
      limit: this.perPage,
      order: [["id", "ASC"]], // or whichever order you want
    });
  }

  // Get count of all pages optionally filtered by publishedOnly
  async getAllPagesCount(publishedOnly = false) {
    const whereClause = publishedOnly ? { isPublished: true } : {};
    return Page.count({ where: whereClause });
  }

  // Create new page; returns created page's ID
  async createPage({ title, description, content, url, isPublished }) {
    const created = await Page.create({
      title,
      shortDescription: description,
      content,
      url,
      isPublished,
    });
    return created.id;
  }

  // Update existing page by ID; returns boolean indicating if update affected any rows
  async updatePage({ id, title, description, content, isPublished }) {
    const [updatedRows] = await Page.update(
      {
        title,
        shortDescription: description,
        content,
        isPublished,
        updatedOn: new Date(),
      },
      { where: { id } }
    );
    return updatedRows > 0;
  }

  // Delete page by ID; returns boolean indicating success
  async deletePage(id) {
    const deletedCount = await Page.destroy({ where: { id } });
    return deletedCount > 0;
  }
}

module.exports = PageRepository;
