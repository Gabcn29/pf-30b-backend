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
        allowNull: false,
        defaultValue: "UserName",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
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
        allowNull: true,
        default: "https://i.pinimg.com/236x/af/de/72/afde727d75f5aa585c407cd89910cb80.jpg",
      },
/*       reportedReviews: {
        type: DataTypes.ARRAY,
        allowNull: true,
      }, */
      email_verified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "updated_at",
      paranoid: true,
    }
  );
};
