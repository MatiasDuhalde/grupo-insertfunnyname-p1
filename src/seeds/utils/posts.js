const faker = require('faker');

const generateRandomPost = () => {
  const randomDate = faker.date.between('2010-04-30', '2021-04-30');

  return {
    userId: Math.floor(Math.random() * 100),
    body: faker.lorem.words(Math.floor(Math.random() * 256)),
    imageLink: `https://picsum.photos/seed/${Math.random()}/1000/500`,
    createdAt: randomDate,
    updatedAt: randomDate,
  };
};

module.exports = {
  generateRandomPosts: (n = 1) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
      posts.push(generateRandomPost());
    }
    return posts;
  },
};
