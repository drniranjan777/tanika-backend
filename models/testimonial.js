const { DataTypes} = require("sequelize");
const sequelize = require("../utils/config/database");

const Testimonial = sequelize.define(
  "Testimonial",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
  },
  {
    tableName: "testimonials",
    timestamps: false,
  }
);

module.exports = Testimonial;
