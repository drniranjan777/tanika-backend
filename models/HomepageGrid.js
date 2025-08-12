const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const HomepageGrid = sequelize.define(
  "HomepageGrid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    image1_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image1_link_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image1_link_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image2_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image2_link_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image2_link_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_link_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_link_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "homepagegrid",
    timestamps: false, // or true if you want createdAt/updatedAt
  }
);

module.exports = HomepageGrid;
