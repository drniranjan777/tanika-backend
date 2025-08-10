const HomepageGrid = require("../models/homepageGrid");
const HomepageGridRepository = require("../repositories/homepageGridRepository");

class HomepageGridService {
  constructor() {
    this.repository = new HomepageGridRepository(HomepageGrid);
  }

  async getAll() {
    return await this.repository.getAllItems();
  }

  async addItem(request) {
    return await this.repository.insertItem(request);
  }

  async getById(id) {
    const item = await this.repository.getItemById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  async updateItem(id, request) {
    const existing = await this.repository.getItemById(id);
    if (!existing) {
      throw new Error("Item not found");
    }

    const updated = {
      image1: request.image1 || existing.image1,
      image2: request.image2 || existing.image2,
      video: request.video || existing.video,
    };

    const success = await this.repository.updateItem(id, updated);
    if (!success) {
      throw new Error("Failed to update item");
    }

    return { status: "success", message: "Homepage grid item updated successfully" };
  }

  async deleteItem(id) {
    const success = await this.repository.deleteItem(id);
    if (!success) {
      throw new Error("Item not found or could not be deleted");
    }

    return { status: "success", message: "Item deleted successfully" };
  }
}

module.exports = new HomepageGridService();
