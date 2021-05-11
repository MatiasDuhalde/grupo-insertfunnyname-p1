const bcrypt = require('bcrypt');

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
    const users = await queryInterface.sequelize.query('SELECT id,email from "Users";');
    const usersFields = users[0];
    const hashedPasswords = await Promise.all(
      usersFields.map((user) => {
        const newPassword = user.email.split('@')[0];
        return bcrypt.hash(newPassword, bcrypt.genSaltSync(8));
      }),
    );
    const promises = [];
    usersFields.forEach((user, index) => {
      const promise = queryInterface.sequelize.query(
        `UPDATE "Users" SET "hashedPassword"='${hashedPasswords[index]}' WHERE "id"=${user.id};`,
      );
      promises.push(promise);
    });
    await Promise.all(promises);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const users = await queryInterface.sequelize.query('SELECT id,email from "Users";');
    const usersFields = users[0];
    const promises = [];
    usersFields.forEach((user) => {
      const promise = queryInterface.sequelize.query(
        `UPDATE "Users" SET "hashedPassword"='' WHERE "id"=${user.id};`,
      );
      promises.push(promise);
    });
    await Promise.all(promises);
  },
};
