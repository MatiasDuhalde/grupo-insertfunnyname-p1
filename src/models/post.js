const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
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
      this.belongsToMany(models.User, {
        as: 'likedPosts',
        through: 'UserLikesPost',
        foreignKey: 'postId',
      });
      this.hasMany(models.UserLikesPost, {
        foreignKey: 'postId',
      });
    }
  }
  Post.init(
    {
      imageLink: DataTypes.STRING,
      body: DataTypes.TEXT,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Post',
    },
  );
  return Post;
};
