const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserLikesPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      this.belongsTo(models.Post, {
        foreignKey: 'postId',
      });
    }
  }
  UserLikesPost.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
          isNumeric: true,
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'UserLikesPost',
    },
  );
  return UserLikesPost;
};
