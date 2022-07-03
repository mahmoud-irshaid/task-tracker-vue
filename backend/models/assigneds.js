"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assigneds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assigneds.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      _id: DataTypes.STRING,
      user: DataTypes.STRING,
      task: DataTypes.STRING,
      recordStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Assigneds",
    }
  );
  return Assigneds;
};
