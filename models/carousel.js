const { DataTypes, Model } = require("sequelize");
// const sequelize = require("../config/database"); // import your Sequelize instance
const sequelize = require("../utils/config/database");

class Carousel extends Model {}

Carousel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "ID",
    },
    actionPayload: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "action_payload",
    },
    imageUrl: { type: DataTypes.STRING, allowNull: false, field: "imageUrl" },
  },
  {
    sequelize,
    modelName: "Carousel",
    tableName: "carousel",
    timestamps: false,
  }
);

module.exports = Carousel;
