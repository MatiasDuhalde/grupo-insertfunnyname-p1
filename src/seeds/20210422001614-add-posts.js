const { generateRandomPosts } = require('./utils/posts');

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = await queryInterface.sequelize.query('SELECT id from "Users";');

    const randomPosts = generateRandomPosts(1000);
    const userIds = users[0];

    const newPosts = randomPosts.map((post) => ({
      ...post,
      userId: userIds[Math.floor(Math.random() * userIds.length)].id,
    }));

    await queryInterface.bulkInsert('Posts', newPosts, {});
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
