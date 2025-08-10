class TestimonialRepository {
  constructor(TestimonialModel) {
    this.Testimonial = TestimonialModel;
  }

  /**
   * Inserts a new testimonial record
   * @param {Object} testimonialItem
   * @returns {Boolean} true if inserted successfully
   */
  async insertTestimonial(testimonialItem) {
    const result = await this.Testimonial.create({
      name: testimonialItem.name,
      testimonial: testimonialItem.testimonial,
      rating : testimonialItem.rating
    });

    return !!result;
  }

  /**
   * Returns all testimonials
   * @returns {Array}
   */
  async getAllTestimonials() {
    const records = await this.Testimonial.findAll();

    return records
  }

  /**
   * Returns a single testimonial by ID
   * @param {Number} id
   * @returns {Object|null}
   */
  async getTestimonialById(id) {
    const record = await this.Testimonial.findByPk(id);
    return record
  }

  /**
   * Updates a testimonial by ID
   * @param {Number} id
   * @param {Object} testimonialItem
   * @returns {Boolean} true if updated
   */
  async updateTestimonial(id, testimonialItem) {
    const [updatedCount] = await this.Testimonial.update(
      {
        name: testimonialItem.name,
        message: testimonialItem.message,
        imageUrl: testimonialItem.imageUrl,
        designation: testimonialItem.designation,
      },
      {
        where: { id },
      }
    );

    return updatedCount > 0;
  }

  /**
   * Deletes a testimonial by ID
   * @param {Number} id
   * @returns {Boolean} true if deleted
   */
  async deleteTestimonial(id) {
    const deletedCount = await this.Testimonial.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  /**
   * Maps DB record to domain object
   */
  mapToDomainObject(record) {
    return {
      id: record.id,
      name: record.name,
      message: record.message,
      imageUrl: record.imageUrl,
      designation: record.designation,
      addedOn: record.addedOn,
    };
  }
}

module.exports = TestimonialRepository;
