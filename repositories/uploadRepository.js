const fs = require('fs');
const path = require('path');

const metadataFile = path.join(__dirname, '..', 'uploads', 'metadata.json');

const saveFileMetadata = (file) => {
  let data = [];

  if (fs.existsSync(metadataFile)) {
    data = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  }

  data.push({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    uploadedAt: new Date()
  });

  fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));
};

module.exports = {
  saveFileMetadata
};
