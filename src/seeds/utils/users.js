const faker = require('faker');

const generateRandomUser = () => {
  const randomDate = faker.date.between('2010-04-30', '2021-04-30');

  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    avatarLink: faker.image.avatar(),
    coverLink: `https://picsum.photos/seed/${Math.random()}/1000/500`,
    createdAt: randomDate,
    updatedAt: randomDate,
  };
};

module.exports = {
  generateRandomUsers: (n = 1) => {
    const users = [];
    for (let i = 0; i < n; i++) {
      users.push(generateRandomUser());
    }
    return users;
  },
};
