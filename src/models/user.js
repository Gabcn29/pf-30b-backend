const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "client",
      },
      avatar: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      anthem: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
    },
    {
      timestamps: false,
      paranoid: true,
    }
  );
};
