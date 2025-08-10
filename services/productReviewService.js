const { Status } = require("../models/common/Status"); // or simple { status: true/false }
const { AttachmentType } = require("../models/common/AttachmentType");
const { RemoteImageFile } = require("../models/common/RemoteImageFile"); // define if needed
const {
  AverageProductRating,
  AverageProductRatingCounts,
} = require("../models/common/AverageProductRating");
const { DataNotFound } = require("../errors");

class ProductReviewService {
  /**
   * @param {number} perPage
   * @param {*} productReviewRepository
   * @param {*} storageDriver
   * @param {*} pagingUtils
   * @param {*} validator
   */
  constructor(
    perPage,
    productReviewRepository,
    storageDriver,
    pagingUtils,
    validator
  ) {
    this.perPage = perPage;
    this.productReviewRepository = productReviewRepository;
    this.storageDriver = storageDriver;
    this.pagingUtils = pagingUtils;
    this.validator = validator;
    this.bucketName = "userReviews";
  }

  async deleteAttachment(reviewId, id) {
    const status = await this.productReviewRepository.deleteAttachment(
      reviewId,
      id
    );
    return new Status(status);
  }

  async getAllReviews(page) {
    const offset = this.pagingUtils.toOffset(page);
    let data = await this.productReviewRepository.getAllReviews(offset);

    // Fetch attachments per review
    data = await Promise.all(
      data.map(async (review) => {
        const attachmentsRaw =
          await this.productReviewRepository.getReviewAttachments(review.id);
        const attachments = attachmentsRaw.map((raw) =>
          this._mapAttachment(raw)
        );
        return this._mapReviewWithAttachments(review, attachments);
      })
    );

    const count = await this.productReviewRepository.getAllReviewsCount();
    return this.pagingUtils.create(count, data);
  }

  async getProductReviews(productId, page) {
    const offset = this.pagingUtils.toOffset(page);
    let reviews = await this.productReviewRepository.getReviewsByProductId(
      productId,
      offset
    );

    reviews = await Promise.all(
      reviews.map(async (review) => {
        const attachmentsRaw =
          await this.productReviewRepository.getReviewAttachments(review.id);
        const attachments = attachmentsRaw.map((raw) =>
          this._mapAttachment(raw)
        );
        return this._mapReviewWithAttachments(review, attachments);
      })
    );

    const count = await this.productReviewRepository.getReviewsByProductIdCount(
      productId
    );
    return this.pagingUtils.create(count, reviews);
  }

  async addProductReview(request, userId) {
    this.validator.validate(request);
    const reviewId = await this.productReviewRepository.insertReview(
      request.comment,
      request.rating,
      userId,
      request.productId
    );
    if (reviewId > 0 && request.attachments && request.attachments.length) {
      await this.processAttachments(
        request.attachments,
        request.isVideo,
        reviewId
      );
    }
    return new Status(reviewId > 0);
  }

  async getAverageRating(productId) {
    const count1 = await this.productReviewRepository.getTotalReviewCount(
      1,
      productId
    );
    const count2 = await this.productReviewRepository.getTotalReviewCount(
      2,
      productId
    );
    const count3 = await this.productReviewRepository.getTotalReviewCount(
      3,
      productId
    );
    const count4 = await this.productReviewRepository.getTotalReviewCount(
      4,
      productId
    );
    const count5 = await this.productReviewRepository.getTotalReviewCount(
      5,
      productId
    );
    const totalCount = await this.productReviewRepository.getTotalReviewCount(
      productId
    );
    const sum = await this.productReviewRepository.getTotalRatingSum(productId);

    if (totalCount === 0) {
      // Avoid division by zero
      return new AverageProductRating(
        0,
        new AverageProductRatingCounts(0, 0, 0, 0, 0),
        0
      );
    }

    const averageRating = sum / totalCount;
    const roundedAverage = Math.round(averageRating * 10) / 10;

    return new AverageProductRating(
      roundedAverage,
      new AverageProductRatingCounts(count5, count4, count3, count2, count1),
      totalCount
    );
  }

  async processAttachments(attachments, isVideo, reviewId) {
    if (!attachments) return;
    for (const file of attachments) {
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      const objectName = `${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${Date.now()}.${ext}`;
      await this.storageDriver.upload(this.bucketName, objectName, file.path);
      const publicLink =
        (await this.storageDriver.getPublicLink(this.bucketName, objectName)) ||
        "";

      const remoteImageFile = new RemoteImageFile(
        this.bucketName,
        objectName,
        publicLink
      );

      const checkExtension = ["png", "jpg", "jpeg"].includes(ext)
        ? AttachmentType.IMAGE
        : AttachmentType.VIDEO;

      await this.productReviewRepository.insertAttachment(
        reviewId,
        remoteImageFile,
        checkExtension
      );
    }
  }

  async editProductReview(request, userId) {
    this.validator.validate(request);
    await this.processAttachments(
      request.attachments,
      request.isVideo,
      request.id
    );
    const result = await this.productReviewRepository.updateReview(
      request.comment,
      request.rating,
      request.id
    );
    return new Status(result);
  }

  async deleteProductReview(userId, reviewId) {
    const status = await this.productReviewRepository.deleteReview(
      userId,
      reviewId
    );
    return new Status(status);
  }

  async deleteProductReviewById(reviewId) {
    const status = await this.productReviewRepository.deleteReview(reviewId);
    return new Status(status);
  }

  // Helper methods to map raw data to domain models

  _mapAttachment(raw) {
    // Assuming raw has properties similar to Kotlin ProductReviewAttachmentRaw
    return {
      id: raw.id,
      type: raw.type,
      file: raw.file, // Assuming file is already a RemoteImageFile or similar
    };
  }

  _mapReviewWithAttachments(review, attachments) {
    // Map review raw data + attachments to your ProductReview domain model structure
    // Adjust according to your actual data shapes
    return {
      ...review, // include all review fields
      attachments,
    };
  }
}

module.exports = ProductReviewService;
