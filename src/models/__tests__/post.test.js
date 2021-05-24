const orm = require('..');

describe('user model', () => {
  const sampleUserData = {
    firstName: 'John',
    lastName: 'Web',
    email: 'user@example.org',
    password: '12345678',
    avatarLink: 'https://cdn.fakercloud.com/avatars/tgerken_128.jpg',
    coverLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
  };

  const mocked = {};

  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true });
    mocked.user = await orm.User.create(sampleUserData);
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('dummyPost', () => {
    const samplePostData = {
      imageLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
      body: 'Insert Funny Name test',
    };

    beforeAll(async () => {
      samplePostData.userId = mocked.user.id;
    });

    test('userId must not be null', async () => {
      const badPostData = { ...samplePostData, userId: undefined };
      await expect(() => orm.Post.create(badPostData)).rejects.toThrowError();
    });

    test('create post', async () => {
      await expect(orm.Post.create(samplePostData)).resolves.toBeInstanceOf(orm.Post);
    });
  });
});
