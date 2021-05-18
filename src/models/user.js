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
      if (password.length < 6) {
        throw Error('Password must be at least 6 characters');
      }
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
          isAlphanumeric: {
            args: true,
            msg: 'First name must be alphanumeric',
          },
          notEmpty: {
            args: true,
            msg: "First name can't be empty",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'Last name must be alphanumeric',
          },
          notEmpty: {
            args: true,
            msg: "Last name can't be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "There's already another account using that email",
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Email must have a valid format',
          },
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
