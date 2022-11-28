const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "billitems",
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
