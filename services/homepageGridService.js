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
    // Make sure request contains all required fields before calling insert
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

    // Use new fields and fallback to existing values if not provided in request
    const updated = {
      // For files, if request contains a new file, update with that; otherwise keep existing
      image1_url: request.image1 ? request.image1 : existing.image1_url,
      image1_link_name: request.image1LinkName || existing.image1_link_name,
      image1_link_url: request.image1LinkUrl || existing.image1_link_url,

      image2_url: request.image2 ? request.image2 : existing.image2_url,
      image2_link_name: request.image2LinkName || existing.image2_link_name,
      image2_link_url: request.image2LinkUrl || existing.image2_link_url,

      video_url: request.video ? request.video : existing.video_url,
      video_link_name: request.videoLinkName || existing.video_link_name,
      video_link_url: request.videoLinkNameUrl || existing.video_link_url,
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
