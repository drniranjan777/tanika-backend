const { Op } = require("sequelize");
const sequelize = require("../config/database"); // Your Sequelize instance
const {
  ProductReview,
  ProductReviewImage,
  User,
  Product,
} = require("../models");
const { runTransaction } = require("../config/dbTransactionManager");
const { AttachmentType } = require("../models/common/AttachmentType"); // Enum or constants matching your Kotlin AttachmentType
const { toJson } = require("../utils/jsonUtils"); // helper for JSON serialization if needed

class ProductReviewRepository {
  constructor(perPage = 10) {
    this.perPage = perPage;
  }

  // Fetch reviews with User and Product info, ordered descending by id with pagination
  async getAllReviews(offset = 0) {
    return runTransaction(sequelize, async (transaction) => {
      const reviews = await ProductReview.findAll({
        include: [
          { model: User, required: true },
          { model: Product, required: true },
        ],
        limit: this.perPage,
        offset,
        order: [["id", "DESC"]],
        transaction,
      });
      return reviews;
    });
  }

  async getAllReviewsCount() {
    return runTransaction(sequelize, async () => {
      return ProductReview.count();
    });
  }

  async getReviewsByProductId(productId, offset = 0) {
    return runTransaction(sequelize, async (transaction) => {
      const reviews = await ProductReview.findAll({
        where: { productId },
        include: [
          { model: User, required: true },
          { model: Product, required: true },
        ],
        limit: this.perPage,
        offset,
        order: [["id", "DESC"]],
        transaction,
      });
      return reviews;
    });
  }

  async getReviewsByProductIdCount(productId) {
    return runTransaction(sequelize, async () => {
      return ProductReview.count({ where: { productId } });
    });
  }

  // Note: Duplicate method name in Kotlin with args (count: Int, productId: Int). We'll name differently
  async getReviewCountByRatingCount(count, productId) {
    return runTransaction(sequelize, async () => {
      const ratingCondition =
        count === 1 || count === 5
          ? { rating: count }
          : {
              rating: {
                [Op.between]: [count, count + 0.9],
              },
            };

      return ProductReview.count({
        where: {
          productId,
          ...ratingCondition,
        },
      });
    });
  }

  async getTotalReviewCount(productId) {
    return runTransaction(sequelize, async () => {
      return ProductReview.count({ where: { productId } });
    });
  }

  async getTotalRatingSum(productId) {
    return runTransaction(sequelize, async () => {
      const result = await ProductReview.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("rating")), "totalRating"],
        ],
        where: { productId },
        raw: true,
      });
      return parseInt(result.totalRating || 0, 10);
    });
  }

  async getReviewAttachments(reviewId) {
    return runTransaction(sequelize, async () => {
      return ProductReviewImage.findAll({
        where: { productReviewId: reviewId },
      });
    });
  }

  async getReview(reviewId) {
    return runTransaction(sequelize, async () => {
      return ProductReview.findOne({
        where: { id: reviewId },
        include: [{ model: User }, { model: Product }],
      });
    });
  }

  async insertReview(comment, rating, userId, productId) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await ProductReview.create(
        { comment, rating, userId, productId },
        { transaction }
      );
      return created.id;
    });
  }

  async updateReview(comment, rating, reviewId) {
    return runTransaction(sequelize, async (transaction) => {
      const [updated] = await ProductReview.update(
        { comment, rating },
        { where: { id: reviewId }, transaction }
      );
      return updated > 0;
    });
  }

  async deleteAttachment(reviewId, attachmentId) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await ProductReviewImage.destroy({
        where: { id: attachmentId, productReviewId: reviewId },
        transaction,
      });
      return deleted > 0;
    });
  }

  async insertAttachment(productReviewId, file, type) {
    // Assuming file is an object representing RemoteImageFile
    return runTransaction(sequelize, async (transaction) => {
      const created = await ProductReviewImage.create(
        {
          productReviewId,
          image: JSON.stringify(file),
          type,
        },
        { transaction }
      );
      return !!created.id;
    });
  }

  async deleteReview(reviewId) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await ProductReview.destroy({
        where: { id: reviewId },
        transaction,
      });
      return deleted > 0;
    });
  }

  async deleteReviewByUser(userId, reviewId) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await ProductReview.destroy({
        where: {
          id: reviewId,
          userId,
        },
        transaction,
      });
      return deleted > 0;
    });
  }
}

module.exports = ProductReviewRepository;
