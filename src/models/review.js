const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
       image: { // Podemos añadir la funcion de que los usuarios puedan adjuntar imagenes del producto junto a su review
        type: DataTypes.STRING,
      },
    }, 
    {
      timestamps: false,
      paranoid: true,
    }
  );
};
