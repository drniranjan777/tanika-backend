const { DataNotFound } = require("../errors");
const slugify = require("slugify"); // for slug generation
const { UploadStatus } = require("../utils/uploadStatus");

class PageService {
  constructor(pageRepository, pagingUtils, validator, storageDriver) {
    this.pageRepository = pageRepository;
    this.pagingUtils = pagingUtils;
    this.validator = validator;
    this.storageDriver = storageDriver;
  }

  async getPages(pageNo, publishedOnly) {
    const itemCount = await this.pageRepository.getAllPagesCount(publishedOnly);
    const offset = this.pagingUtils.toOffset(pageNo);
    const items = await this.pageRepository.getAllPages(publishedOnly, offset);
    return this.pagingUtils.create(itemCount, items);
  }

  async getPage(url) {
    const page = await this.pageRepository.getPageByUrl(url);
    if (!page) throw new DataNotFound();
    return page;
  }

  // Slugify title; append timestamp suffix if duplicate
  async createPage(request) {
    this.validator.validate(request);
    let url = slugify(request.title, { lower: true, strict: true });
    const existingPage = await this.pageRepository.getPageByUrl(url);
    if (existingPage) {
      url = `${url}-${Date.now()}`;
    }
    const pageId = await this.pageRepository.createPage({
      title: request.title,
      description: request.description,
      content: request.content,
      url,
      isPublished: request.isPublished,
    });
    return { status: pageId > 0 };
  }

  async updatePage(request) {
    this.validator.validate(request);
    const result = await this.pageRepository.updatePage({
      id: request.id,
      title: request.title,
      description: request.description,
      content: request.content,
      isPublished: request.isPublished,
    });
    return { status: result };
  }

  async deletePage(id) {
    const result = await this.pageRepository.deletePage(id);
    return { status: result };
  }

  async insertImage(files) {
    const urls = [];
    for (const file of files) {
      const status = await this.storageDriver.upload(
        "pages",
        file.originalname,
        file.path
      );
      if (status === UploadStatus.COMPLETE) {
        const link = await this.storageDriver.getPublicLink(
          "pages",
          file.originalname
        );
        urls.push(link);
      }
    }
    return urls;
  }
}

module.exports = PageService;
