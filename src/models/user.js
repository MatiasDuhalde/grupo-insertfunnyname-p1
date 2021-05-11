const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

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
      this.hasMany(models.UserLikesPost, {
        foreignKey: 'userId',
      });
    }

    static generateHash(password) {
      return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }

    validatePassword(password) {
      return bcrypt.compare(password, this.hashedPassword);
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          notEmpty: true,
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
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
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
