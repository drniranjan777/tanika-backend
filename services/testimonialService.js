const Testimonial = require("../models/testimonial");
const TestimonialRepository = require("../repositories/testimonialRepository");

class TestimonialService {
  constructor() {
    this.repository = new TestimonialRepository(Testimonial);
  }

  // Get all testimonials
  async getTestimonials() {
    return await this.repository.getAllTestimonials();
  }

  // Add a new testimonial
  async addTestimonial(request) {
    return await this.repository.insertTestimonial(request);
  }

  // Get a testimonial by ID
  async getTestimonialById(id) {
    const testimonial = await this.repository.getTestimonialById(id);
    if (!testimonial) {
      throw new Error("Testimonial not found");
    }
    return testimonial;
  }

  // Edit a testimonial
  async editTestimonial(id, request) {
    const existing = await this.repository.getTestimonialById(id);
    if (!existing) {
      throw new Error("Testimonial not found");
    }

    const updated = {
      name: request.name || existing.name,
      message: request.message || existing.message,
      imageUrl: request.imageUrl || existing.imageUrl,
      designation: request.designation || existing.designation,
    };

    const success = await this.repository.updateTestimonial(id, updated);
    if (!success) {
      throw new Error("Failed to update testimonial");
    }

    return { status: "success", message: "Testimonial updated successfully" };
  }

  // Delete a testimonial
  async deleteTestimonial(id) {
    const success = await this.repository.deleteTestimonial(id);
    if (!success) {
      throw new Error("Testimonial not found or could not be deleted");
    }

    return { status: "success", message: "Testimonial deleted successfully" };
  }
}

module.exports = new TestimonialService();
