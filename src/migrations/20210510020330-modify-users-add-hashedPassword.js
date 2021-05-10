module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'hashedPassword', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: '',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'hashedPassword');
  },
};
