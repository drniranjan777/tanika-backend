class HomepageGridRepository {
  constructor(HomepageGridModel) {
    this.HomepageGrid = HomepageGridModel;
  }

  async insertItem(item) {
    const result = await this.HomepageGrid.create({
      image1_url: item.image1Url,
      image1_link_name: item.image1LinkName,
      image1_link_url: item.image1LinkUrl,

      image2_url: item.image2Url,
      image2_link_name: item.image2LinkName,
      image2_link_url: item.image2LinkUrl,

      video_url: item.videoUrl,
      video_link_name: item.videoLinkName,
      video_link_url: item.videoLinkNameUrl,
    });
    return !!result;
  }

  async getAllItems() {
    return await this.HomepageGrid.findAll();
  }

  async getItemById(id) {
    return await this.HomepageGrid.findByPk(id);
  }

  async updateItem(id, updatedItem) {
    const [updatedCount] = await this.HomepageGrid.update(
      {
        image1_url: updatedItem.image1_url,
        image1_link_name: updatedItem.image1_link_name,
        image1_link_url: updatedItem.image1_link_url,

        image2_url: updatedItem.image2_url,
        image2_link_name: updatedItem.image2_link_name,
        image2_link_url: updatedItem.image2_link_url,

        video_url: updatedItem.video_url,
        video_link_name: updatedItem.video_link_name,
        video_link_url: updatedItem.video_link_url,
      },
      {
        where: { id },
      }
    );

    return updatedCount > 0;
  }

  async deleteItem(id) {
    const deletedCount = await this.HomepageGrid.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }
}

module.exports = HomepageGridRepository;
