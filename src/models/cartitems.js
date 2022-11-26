const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "cartitems",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
