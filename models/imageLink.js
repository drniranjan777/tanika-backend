const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); // import your Sequelize instance

const ImageLinkType = ["BANNER", "THUMBNAIL", "GALLERY"]; // Example; match Kotlin ImageLinkType ordinal

class ImageLink extends Model {}

ImageLink.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    folder: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    displayType: { type: DataTypes.INTEGER, allowNull: false }, // ordinal for ImageLinkType
    priority: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "ImageLink",
    tableName: "ImageLinksTable",
    timestamps: false,
  }
);

module.exports = ImageLink;
