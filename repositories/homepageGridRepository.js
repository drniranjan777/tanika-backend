class HomepageGridRepository {
  constructor(HomepageGridModel) {
    this.HomepageGrid = HomepageGridModel;
  }

  async insertItem(item) {
    const result = await this.HomepageGrid.create({
      image1: item.image1,
      image2: item.image2,
      video: item.video,
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
        image1: updatedItem.image1,
        image2: updatedItem.image2,
        video: updatedItem.video,
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
