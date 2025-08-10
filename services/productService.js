const { DataNotFound } = require("../errors");
const Status = require("../models/common/Status");
const pagingUtils = require("../utils/pagingUtils"); // instance created with perPage
const productRepository = require("../repositories/productRepository");
const validator = require("../utils/validator");
const storageDriver = require("../utils/storageDriver"); // implement per your infra

class ProductService {
  constructor(
    repo = productRepository,
    pageUtils = pagingUtils,
    iValidator = validator,
    iStorageDriver = storageDriver
  ) {
    this.productRepository = repo;
    this.pageUtils = pageUtils;
    this.iValidator = iValidator;
    this.iStorageDriver = iStorageDriver;
    this.bucketName = "products";
  }

  createUrlFriendlyString(val) {
    const name =
      val
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric
        .replace(/\s+/g, " ")
        .trim()
        .replace(/ /g, "-") +
      "-" +
      Date.now();
    return name;
  }

  // --- Categories ---
  async getCategories() {
    return this.productRepository.getCategoryList();
  }

  async createCategory(request) {
    validator.validateCreateCategoryRequest(request); // throws on fail
    const url = this.createUrlFriendlyString(request.name);
    const id = await this.productRepository.insertCategory(request.name, url);
    const cat = await this.productRepository.getCategory(id);
    if (!cat) throw new DataNotFound();
    return cat;
  }

  async editCategory(request) {
    validator.validateEditCategoryRequest(request);
    const url = this.createUrlFriendlyString(request.name);
    const res = await this.productRepository.updateCategory(
      request.id,
      request.name,
      url
    );
    return new Status(res);
  }

  async deleteCategory(id) {
    const res = await this.productRepository.deleteCategory(id);
    return new Status(res);
  }

  async addProductToCategory(id, product) {
    const res =
      (await this.productRepository.insertProductCategory(id, product)) > 0;
    return new Status(res);
  }

  async removeProductFromCategory(id, product) {
    const res =
      (await this.productRepository.deleteProductCategory(id, product)) > 0;
    return new Status(res);
  }

  // --- Sections ---
  async getSections() {
    return this.productRepository.getSectionList();
  }

  async createProductSection(request) {
    validator.validateCreateSectionRequest(request);
    const url = this.createUrlFriendlyString(request.name);
    const id = await this.productRepository.insertSection(request.name, url);
    const section = await this.productRepository.getProductSection(id);
    if (!section) throw new DataNotFound();
    return section;
  }

  async editProductSection(request) {
    validator.validateEditSectionRequest(request);
    const url = this.createUrlFriendlyString(request.name);
    const res = await this.productRepository.updateSection(
      request.id,
      request.name,
      url
    );
    return new Status(res);
  }

  async deleteSection(id) {
    const res = await this.productRepository.deleteSection(id);
    return new Status(res);
  }

  async addProductToSection(sectionId, productId) {
    const res =
      (await this.productRepository.insertProductSection(
        sectionId,
        productId
      )) > 0;
    return new Status(res);
  }

  async removeProductFromSection(sectionId, productId) {
    const res =
      (await this.productRepository.deleteProductSection(
        sectionId,
        productId
      )) > 0;
    return new Status(res);
  }

  // --- Properties/Filters ---
  async createProductProperty(request) {
    validator.validateCreateProductPropertyRequest(request);
    const id = await this.productRepository.insertProductProperty(
      request.name,
      request.value
    );
    const property = await this.productRepository.getProductProperty(id);
    if (!property) throw new DataNotFound();
    return property;
  }

  async editProductProperty(request) {
    validator.validateEditProductPropertyRequest(request);
    const res = await this.productRepository.updateProductProperty(
      request.id,
      request.name,
      request.value
    );
    return new Status(res);
  }

  async deleteProductProperty(id) {
    return new Status(await this.productRepository.deleteProductProperty(id));
  }
  async getProperty(id) {
    return this.productRepository.getProductProperty(id);
  }
  async getAllProperties() {
    return this.productRepository.getAllProductProperties();
  }
  async getPropertiesForProduct(productId) {
    return this.productRepository.getProductPropertiesForProduct(productId);
  }

  // --- Sizes ---
  async getSizesForProduct(productId) {
    return this.productRepository.getSizeOptionForProduct(productId);
  }
  async addSizeToProduct(productId, sizeId) {
    return new Status(
      await this.productRepository.addSizeToProduct(productId, sizeId)
    );
  }
  async removeSizeFromProduct(productId, sizeId) {
    return new Status(
      await this.productRepository.removeSizeFromProduct(productId, sizeId)
    );
  }
  async getAllSizeOptions() {
    return this.productRepository.getAllSizeOptions();
  }
  async getSizeOptionById(id) {
    return this.productRepository.getSizeOptionById(id);
  }
  async createSizeOption(request) {
    validator.validateCreateSizeOptionRequest(request);
    const id = await this.productRepository.createSizeOption(
      request.name,
      request.displayName
    );
    const size = await this.productRepository.getSizeOptionById(id);
    if (!size) throw new DataNotFound();
    return size;
  }
  async updateSizeOption(request) {
    validator.validateEditSizeOptionRequest(request);
    return new Status(
      await this.productRepository.updateSizeOption(
        request.id,
        request.name,
        request.displayName
      )
    );
  }
  async deleteSizeOption(id) {
    return new Status(await this.productRepository.deleteSizeOption(id));
  }
  async activateSizeOption(id) {
    return new Status(await this.productRepository.activateSizeOption(id));
  }
  async deactivateSizeOption(id) {
    return new Status(await this.productRepository.deactivateSizeOption(id));
  }

  async toggleSizeOptionActivation(id) {
    const sizeOption = await this.productRepository.getSizeOptionById(id);
    if (!sizeOption) return new Status(false);
    return sizeOption.visibility
      ? await this.deactivateSizeOption(id)
      : await this.activateSizeOption(id);
  }

  // --- Product CRUD ---
  async addProduct(request) {
    validator.validateCreateProductRequest(request);
    const url = this.createUrlFriendlyString(request.name);

    // Upload thumbnail
    const thumbStatus = await this.iStorageDriver.upload(
      this.bucketName,
      request.thumbnail.name,
      request.thumbnail.absolutePath
    );
    const thumbUrl = await this.iStorageDriver.getPublicLink(
      this.bucketName,
      request.thumbnail.name
    );
    if (thumbStatus !== "COMPLETE" || !thumbUrl) throw new DataNotFound();
    const thumbnail = {
      bucket: this.bucketName,
      name: request.thumbnail.name,
      url: thumbUrl,
    };

    // Upload screens
    const screens = [];
    for (const file of request.screens) {
      await this.iStorageDriver.upload(
        this.bucketName,
        file.name,
        file.absolutePath
      );
      const screenUrl = await this.iStorageDriver.getPublicLink(
        this.bucketName,
        file.name
      );
      if (screenUrl)
        screens.push({
          bucket: this.bucketName,
          name: file.name,
          url: screenUrl,
        });
    }

    const id = await this.productRepository.addProduct({
      name: request.name,
      description: request.description,
      thumbnail: JSON.stringify(thumbnail),
      visibility: request.visibility,
      screens: JSON.stringify(screens),
      price: request.price,
      discount: request.discount,
      isFeatured: request.isFeatured,
      vanityUrl: url,
    });

    const prod = await this.productRepository.getProductById(id);
    if (!prod) throw new DataNotFound();
    return prod;
  }

  async updateProduct(request) {
    validator.validateEditProductRequest(request);
    const productItem = await this.productRepository.getProductRawById(
      request.id
    );
    if (!productItem) throw new DataNotFound();

    let thumbnail = productItem.thumbnail;
    if (request.thumbnail) {
      const status = await this.iStorageDriver.upload(
        this.bucketName,
        request.thumbnail.name,
        request.thumbnail.absolutePath
      );
      const thumbUrl = await this.iStorageDriver.getPublicLink(
        this.bucketName,
        request.thumbnail.name
      );
      if (status !== "COMPLETE" || !thumbUrl) throw new DataNotFound();
      thumbnail = {
        bucket: this.bucketName,
        name: request.thumbnail.name,
        url: thumbUrl,
      };
    }

    // Manage screens: remove, add, keep existing
    let screens = productItem.previews || [];
    if (request.removedScreens) {
      screens = screens.filter((s) => !request.removedScreens.includes(s.url));
      for (const scr of screens) {
        await this.iStorageDriver.delete(scr.bucket, scr.name);
      }
    }
    if (request.screens) {
      for (const file of request.screens) {
        await this.iStorageDriver.upload(
          this.bucketName,
          file.name,
          file.absolutePath
        );
        const url = await this.iStorageDriver.getPublicLink(
          this.bucketName,
          file.name
        );
        if (url)
          screens.push({ bucket: this.bucketName, name: file.name, url });
      }
    }

    return await this.productRepository.updateProduct(request.id, {
      name: request.name,
      description: request.description,
      thumbnail: JSON.stringify(thumbnail),
      visibility: request.visibility,
      screens: JSON.stringify(screens),
      price: request.price,
      discount: request.discount,
      isFeatured: request.isFeatured,
    });
  }

  async deleteProduct(id) {
    return await this.productRepository.deleteProduct(id);
  }

  // --- Product Filters/Search/Relations ---

  async getProductsBySearch(query, pageNo) {
    const total = await this.productRepository.getProductByQueryCount(query);
    const offset = this.pageUtils.toOffset(pageNo);
    const items = await this.productRepository.getProductByQuery(query, offset);
    return this.pageUtils.create(total, items);
  }

  async getAllProducts(page) {
    const offset = this.pageUtils.toOffset(page);
    const items = await this.productRepository.getAllProductWithSizes(offset);
    const count = await this.productRepository.getAllProductWithSizesCount();
    return this.pageUtils.create(count, items);
  }

  // These methods provide paginated, filtered search and aggregation per your Kotlin logic.
  async getProducts(
    section = null,
    categoryId = null,
    filters = null,
    sort,
    pageNo
  ) {
    const total = await this.productRepository.getProductCount(
      section,
      categoryId,
      filters
    );
    const offset = this.pageUtils.toOffset(pageNo);
    const items = await this.productRepository.getProducts(
      section,
      categoryId,
      filters,
      sort,
      offset
    );
    return this.pageUtils.create(total, items);
  }

  async getProductById(id) {
    const product = await this.productRepository.getProductById(id);
    if (!product) throw new DataNotFound();
    return product;
  }
}

module.exports = new ProductService();
