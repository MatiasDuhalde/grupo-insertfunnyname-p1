const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post, {
        foreignKey: 'userId',
      });
      this.belongsToMany(models.Post, {
        as: 'likedPosts',
        through: 'UserLikesPost',
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          isNumeric: false,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          isNumeric: false,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      avatarLink: {
        type: DataTypes.STRING,
      },
      coverLink: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
