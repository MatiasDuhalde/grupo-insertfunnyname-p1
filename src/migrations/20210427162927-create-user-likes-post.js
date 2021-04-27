module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserLikesPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        onDelete: 'CASCADE',
        references: { model: 'Users', key: 'id' },
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
      },
      postId: {
        allowNull: false,
        onDelete: 'CASCADE',
        references: { model: 'Posts', key: 'id' },
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('UserLikesPosts');
  },
};
