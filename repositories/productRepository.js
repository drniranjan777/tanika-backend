const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const {
  Product,
  ProductProperty,
  ProductsAndProperties,
  SizeOption,
  ProductsAndSizes,
  Category,
  ProductCategories,
  ProductSection,
  ProductsAndSections,
} = require("../models");
const { runTransaction } = require("../config/dbTransactionManager");

class ProductRepository {
  constructor(perPage = 20) {
    this.perPage = perPage;
  }

  // ---- Product Property Methods ----

  async insertProductProperty(name, value) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await ProductProperty.create(
        { name, value },
        { transaction }
      );
      return created.id;
    });
  }

  async updateProductProperty(id, name, value) {
    return runTransaction(sequelize, async (transaction) => {
      const [updated] = await ProductProperty.update(
        { name, value },
        { where: { id }, transaction }
      );
      return updated > 0;
    });
  }

  async deleteProductProperty(id) {
    return runTransaction(sequelize, async (transaction) => {
      await ProductsAndProperties.destroy({
        where: { propertyId: id },
        transaction,
      }); // remove relations first
      const deleted = await ProductProperty.destroy({
        where: { id },
        transaction,
      });
      return deleted > 0;
    });
  }

  async getProductProperty(id) {
    return ProductProperty.findByPk(id);
  }

  async getAllProductProperties() {
    return ProductProperty.findAll();
  }

  async getProductPropertiesForProduct(productId) {
    return ProductProperty.findAll({
      include: [
        {
          model: ProductsAndProperties,
          as: "ProductRelation",
          where: { productId },
          attributes: [],
        },
      ],
    });
  }

  // ---- SizeOption Methods ----

  async getSizeOptionForProduct(productId) {
    return SizeOption.findAll({
      include: [
        {
          model: ProductsAndSizes,
          as: "ProductSizeRelation",
          where: { productId },
          attributes: [],
        },
      ],
    });
  }

  async addSizeToProduct(productId, sizeId) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await ProductsAndSizes.create(
        { productId, sizeId },
        { transaction }
      );
      return !!created.id;
    });
  }

  async removeSizeFromProduct(productId, sizeId) {
    return runTransaction(sequelize, async (transaction) => {
      const deleted = await ProductsAndSizes.destroy({
        where: { productId, sizeId },
        transaction,
      });
      return deleted > 0;
    });
  }

  async getAllSizeOptions() {
    return SizeOption.findAll();
  }

  async getSizeOptionById(id) {
    return SizeOption.findByPk(id);
  }

  async createSizeOption(name, displayName) {
    const created = await SizeOption.create({
      name,
      displayName,
      activated: true,
    });
    return created.id;
  }

  async updateSizeOption(id, name, displayName) {
    const [updated] = await SizeOption.update(
      { name, displayName },
      { where: { id } }
    );
    return updated > 0;
  }

  async deleteSizeOption(id) {
    const deleted = await SizeOption.destroy({ where: { id } });
    return deleted > 0;
  }

  async activateSizeOption(id) {
    const [updated] = await SizeOption.update(
      { activated: true },
      { where: { id } }
    );
    return updated > 0;
  }

  async deactivateSizeOption(id) {
    const [updated] = await SizeOption.update(
      { activated: false },
      { where: { id } }
    );
    return updated > 0;
  }

  // ---- Product CRUD ----

  async addProduct({
    name,
    description,
    thumbnail,
    visibility,
    screens,
    price,
    discount,
    isFeatured,
    vanityUrl,
  }) {
    const created = await Product.create({
      name,
      description,
      thumbnail,
      visibility,
      screens,
      price,
      discount,
      isFeatured,
      vanityUrl,
      orderedTimes: 0,
    });
    return created.id;
  }

  async updateProduct(
    id,
    {
      name,
      description,
      thumbnail,
      visibility,
      screens,
      price,
      discount,
      isFeatured,
    }
  ) {
    const [updated] = await Product.update(
      {
        name,
        description,
        thumbnail,
        visibility,
        screens,
        price,
        discount,
        isFeatured,
      },
      { where: { id } }
    );
    return updated > 0;
  }

  async deleteProduct(id) {
    return runTransaction(sequelize, async (transaction) => {
      await ProductCategories.destroy({
        where: { productId: id },
        transaction,
      });
      await ProductsAndSections.destroy({
        where: { productId: id },
        transaction,
      });
      await ProductsAndSizes.destroy({ where: { productId: id }, transaction });
      await ProductsAndProperties.destroy({
        where: { productId: id },
        transaction,
      });
      const deleted = await Product.destroy({ where: { id }, transaction });
      return deleted > 0;
    });
  }

  async getAllProductWithSizes(offset = 0) {
    return Product.findAll({
      limit: this.perPage,
      offset,
      include: [SizeOption],
    });
  }

  async getAllProductWithSizesCount() {
    return Product.count();
  }

  async getProductById(id) {
    return Product.findByPk(id);
  }

  async getProduct(url) {
    return Product.findOne({ where: { vanityUrl: url } });
  }

  // ---- Property, Size/Section/Category Linking ----

  async addPropertyToProduct(productId, propertyId) {
    const created = await ProductsAndProperties.create({
      productId,
      propertyId,
    });
    return !!created.id;
  }

  async removePropertyFromProduct(productId, propertyId) {
    const deleted = await ProductsAndProperties.destroy({
      where: { productId, propertyId },
    });
    return deleted > 0;
  }

  async removeAllPropertyFromProduct(propertyId) {
    const deleted = await ProductsAndProperties.destroy({
      where: { propertyId },
    });
    return deleted > 0;
  }

  // ---- Section Methods ----

  async getSectionList() {
    return ProductSection.findAll();
  }

  async insertSection(name, url) {
    const created = await ProductSection.create({ name, url });
    return created.id;
  }

  async updateSection(id, name, url) {
    const [updated] = await ProductSection.update(
      { name, url },
      { where: { id } }
    );
    return updated > 0;
  }

  async deleteProductSection(section, productId) {
    const deleted = await ProductsAndSections.destroy({
      where: { sectionId: section, productId },
    });
    return deleted > 0;
  }

  async deleteAllProductSections(section) {
    const deleted = await ProductsAndSections.destroy({
      where: { sectionId: section },
    });
    return deleted > 0;
  }

  async deleteSection(section) {
    return runTransaction(sequelize, async (transaction) => {
      await ProductsAndSections.destroy({
        where: { sectionId: section },
        transaction,
      });
      const deleted = await ProductSection.destroy({
        where: { id: section },
        transaction,
      });
      return deleted > 0;
    });
  }

  async insertProductSection(section, productId) {
    const created = await ProductsAndSections.create({
      sectionId: section,
      productId,
    });
    return created.sectionId;
  }

  // ---- Category Methods ----

  async getCategoryList() {
    return Category.findAll();
  }

  async insertCategory(name, url) {
    const created = await Category.create({ name, url });
    return created.id;
  }

  async updateCategory(id, name, url) {
    const [updated] = await Category.update({ name, url }, { where: { id } });
    return updated > 0;
  }

  async insertProductCategory(category, productId) {
    const created = await ProductCategories.create({
      categoryId: category,
      productId,
    });
    return created.id;
  }

  async deleteProductCategory(category, productId) {
    const deleted = await ProductCategories.destroy({
      where: { categoryId: category, productId },
    });
    return deleted > 0;
  }

  async deleteAllProductCategory(category) {
    const deleted = await ProductCategories.destroy({
      where: { categoryId: category },
    });
    return deleted > 0;
  }

  async deleteCategory(category) {
    return runTransaction(sequelize, async (transaction) => {
      await ProductCategories.destroy({
        where: { categoryId: category },
        transaction,
      });
      const deleted = await Category.destroy({
        where: { id: category },
        transaction,
      });
      return deleted > 0;
    });
  }

  // ---- Property/Size/Section/Category Query Methods ----

  async getProductPropertiesForProduct(productId) {
    return ProductProperty.findAll({
      include: [
        { model: ProductsAndProperties, where: { productId }, attributes: [] },
      ],
    });
  }

  async getSizeOptionList(productId) {
    return SizeOption.findAll({
      include: [
        { model: ProductsAndSizes, where: { productId }, attributes: [] },
      ],
    });
  }

  async getProductCategories(productId) {
    return Category.findAll({
      include: [
        {
          model: ProductCategories,
          where: { productId },
          attributes: [],
        },
      ],
    });
  }

  async getProductSections(productId) {
    return ProductSection.findAll({
      include: [
        {
          model: ProductsAndSections,
          where: { productId },
          attributes: [],
        },
      ],
    });
  }

  async getCategory(category) {
    // accept category id or url
    if (typeof category === "number") {
      return Category.findByPk(category);
    }
    return Category.findOne({ where: { url: category } });
  }

  async getSection(section) {
    // accept section id or url
    if (typeof section === "number") {
      return ProductSection.findByPk(section);
    }
    return ProductSection.findOne({ where: { url: section } });
  }

  // ---- Product Search and Listing ----

  async getProductsCount({
    section = null,
    categoryId = null,
    filters = null,
    sort = "A_Z",
  } = {}) {
    // Compose filter object for count
    const whereClause = {};
    if (categoryId) {
      whereClause["$ProductCategories.categoryId$"] = categoryId;
    }
    if (section) {
      whereClause["$ProductsAndSections.sectionId$"] = section;
    }
    // Add more filters as needed. For multi-table filtering, use include[] with required: true

    return Product.count({
      include: [
        ...(categoryId
          ? [
              {
                model: ProductCategories,
                where: { categoryId },
                required: true,
              },
            ]
          : []),
        ...(section
          ? [
              {
                model: ProductsAndSections,
                where: { sectionId: section },
                required: true,
              },
            ]
          : []),
      ],
      where: whereClause,
      distinct: true,
    });
  }

  async getProducts({
    section = null,
    categoryId = null,
    filters = null,
    sort = "A_Z",
    offset = 0,
  } = {}) {
    // Compose sort array
    let sortArray = [["name", "ASC"]];
    switch (sort) {
      case "A_Z":
        sortArray = [["name", "ASC"]];
        break;
      case "Z_A":
        sortArray = [["name", "DESC"]];
        break;
      case "PriceLowToHigh":
        sortArray = [["price", "ASC"]];
        break;
      case "PriceHighToLow":
        sortArray = [["price", "DESC"]];
        break;
      case "DateAddedOldFirst":
        sortArray = [["addedOn", "ASC"]];
        break;
      case "DateAddedNewFirst":
        sortArray = [["addedOn", "DESC"]];
        break;
      case "BestSelling":
        sortArray = [["orderedTimes", "DESC"]];
        break;
      case "Featured":
        sortArray = [["isFeatured", "DESC"]];
        break;
    }

    // Compose include for filters, category, section
    const include = [
      ...(categoryId
        ? [{ model: ProductCategories, where: { categoryId }, required: true }]
        : []),
      ...(section
        ? [
            {
              model: ProductsAndSections,
              where: { sectionId: section },
              required: true,
            },
          ]
        : []),
      ...(filters
        ? [
            {
              model: ProductsAndProperties,
              where: { propertyId: { [Op.in]: filters } },
              required: true,
            },
          ]
        : []),
    ];

    return Product.findAll({
      include,
      order: sortArray,
      limit: this.perPage,
      offset,
      distinct: true,
    });
  }

  // ---- Related products ----

  async getRelatedProducts(productId, categoryIds) {
    return Product.findAll({
      include: [
        {
          model: ProductCategories,
          where: { categoryId: { [Op.in]: categoryIds } },
          required: true,
        },
      ],
      where: { id: { [Op.ne]: productId } },
      limit: 10,
      group: ["Product.id"],
    });
  }

  // ---- Full-text Search (MySQL/MariaDB with proper index!) ----

  async getProductByQueryCount(query) {
    return Product.count({
      where: {
        visibility: true,
        [Op.or]: [
          Sequelize.literal(
            `MATCH(name, description) AGAINST('${query}' IN NATURAL LANGUAGE MODE)`
          ),
          { name: { [Op.like]: `%${query}%` } },
        ],
      },
    });
  }

  async getProductByQuery(query, offset = 0) {
    return Product.findAll({
      where: {
        visibility: true,
        [Op.or]: [
          Sequelize.literal(
            `MATCH(name, description) AGAINST('${query}' IN NATURAL LANGUAGE MODE)`
          ),
          { name: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: this.perPage,
      offset,
    });
  }
}

module.exports = ProductRepository;
