const faker = require('faker');

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
    const maxPostsLikedPerUser = 10;

    // Fetching
    const users = await queryInterface.sequelize.query('SELECT "id","createdAt" from "Users";');
    const usersFields = users[0];
    const posts = await queryInterface.sequelize.query('SELECT "id","createdAt" from "Posts";');
    const postsFields = posts[0];

    const newUserLikesPosts = [];
    usersFields.forEach((user) => {
      const postsLikedNumber = Math.floor(Math.random() * (maxPostsLikedPerUser + 1));
      for (let i = 0; i < postsLikedNumber; i += 1) {
        const post = postsFields[Math.floor(Math.random() * postsFields.length)];
        const lBoundDate = user.createdAt > post.createdAt ? user.createdAt : post.createdAt;
        const likedDate = faker.date.between(lBoundDate, '2021-04-30');
        const userLikesPostObject = {
          userId: user.id,
          postId: post.id,
          createdAt: likedDate,
          updatedAt: likedDate,
        };
        newUserLikesPosts.push(userLikesPostObject);
      }
    });
    await queryInterface.bulkInsert('UserLikesPosts', newUserLikesPosts, {});
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserLikesPosts', null, {});
  },
};
