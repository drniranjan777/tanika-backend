const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); // import your Sequelize instance

const HomePageSectionType = ["BANNER", "PRODUCTS", "CUSTOM"]; // Adjust as needed

class HomePageSection extends Model {}

HomePageSection.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sectionType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "section_type",
    }, // ordinal for HomePageSectionType enum
    additionPayload: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "payload",
    },
    heading: { type: DataTypes.STRING, allowNull: false, field: "heading" },
    priority: { type: DataTypes.INTEGER, allowNull: false, field: "priority" },
  },
  {
    sequelize,
    modelName: "HomePageSection",
    tableName: "homepage",
    timestamps: false,
  }
);

module.exports = HomePageSection;
