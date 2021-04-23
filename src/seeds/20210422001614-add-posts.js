'use strict';
const { generateRandomPosts } = require('./utils/posts');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );

    const randomPosts = generateRandomPosts(1000);
    const userIds = users[0];

    randomPosts.forEach((post) => {
      post.userId = userIds[Math.floor(Math.random() * userIds.length)].id;
    });

    await queryInterface.bulkInsert('Posts', randomPosts, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
