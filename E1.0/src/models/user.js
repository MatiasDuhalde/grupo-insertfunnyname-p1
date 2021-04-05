'use strict';
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    generateHash(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
