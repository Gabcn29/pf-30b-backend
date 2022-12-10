const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "cartitems",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      articleId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: true,
    }
  );
};
