// storageDriver.js

class StorageDriver {
  /**
   * @param {string} driverName
   * @param {{ [key: string]: string }} arguments
   * @param {LoggerConnector} loggerConnector
   */
  constructor(driverName, argumentsMap, loggerConnector) {
    this.driverName = driverName;
    this.arguments = argumentsMap;
    this.loggerConnector = loggerConnector;

    this.storageDriver = null;
  }

  async init() {
    if (this.storageDriver) return;

    switch (this.driverName) {
      case "disk":
        const DiskStorageConnector = require("./connectors/DiskStorageConnector");
        this.storageDriver = new DiskStorageConnector(this.loggerConnector);
        await this.storageDriver.init(this.arguments);
        break;

      case "test":
        const TestStorageConnector = require("./connectors/TestStorageConnector");
        this.storageDriver = new TestStorageConnector(this.loggerConnector);
        await this.storageDriver.init(this.arguments);
        break;

      default:
        throw new Error(`Unknown storage driver: ${this.driverName}`);
    }
  }

  async upload(bucketName, objectName, filePath) {
    await this.init();
    return this.storageDriver.upload(bucketName, objectName, filePath);
  }

  async delete(bucketName, objectName) {
    await this.init();
    return this.storageDriver.delete(bucketName, objectName);
  }

  async generateTemporaryLink(bucketName, objectName, expiryInSeconds) {
    await this.init();
    return this.storageDriver.generateTemporaryLink(
      bucketName,
      objectName,
      expiryInSeconds
    );
  }

  async getPublicLink(bucketName, objectName) {
    await this.init();
    return this.storageDriver.getPublicLink(bucketName, objectName);
  }
}

module.exports = StorageDriver;
