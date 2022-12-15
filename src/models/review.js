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
      reports: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      reportedBy: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      
    }, 
    {
      timestamps: false,
      paranoid: true,
    }
  );
};
