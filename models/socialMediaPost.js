const { DataTypes, Model } = require("sequelize");
// const sequelize = require("../config/database"); // import your Sequelize instance
const sequelize = require("../utils/config/database");

const SocialMediaPostContentType = ["IMAGE", "VIDEO", "TEXT"]; // Update per your enum

class SocialMediaPost extends Model {}

SocialMediaPost.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    file: { type: DataTypes.JSON, allowNull: false }, // Stores JSON (RemoteImageFile)
    videoFile: { type: DataTypes.JSON, allowNull: true }, // Stores JSON (RemoteVideoFile or null)
    contentType: { type: DataTypes.INTEGER, allowNull: false }, // ordinal for enum
    targetLink: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "SocialMediaPost",
    tableName: "SocialMediaPostTable",
    timestamps: false,
  }
);

module.exports = SocialMediaPost;
