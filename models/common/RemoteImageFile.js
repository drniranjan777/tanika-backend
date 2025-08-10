class RemoteImageFile {
  constructor(bucket = "", objectName = "", url = "") {
    this.bucket = bucket;
    this.objectName = objectName;
    this.url = url;
  }
}

module.exports = { RemoteImageFile };
