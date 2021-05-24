const orm = require('..');

describe('userlikespost model', () => {
  const sampleUserData = {
    firstName: 'John',
    lastName: 'Web',
    email: 'user@example.org',
    password: '12345678',
    avatarLink: 'https://cdn.fakercloud.com/avatars/tgerken_128.jpg',
    coverLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
  };
  const samplePostData = {
    imageLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
    body: 'Insert Funny Name test',
  };

  let user;
  let post;

  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true });
    user = await orm.User.create(sampleUserData);
    samplePostData.userId = user.id;
    post = await orm.Post.create(samplePostData);
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('create user likes post', () => {
    test('userId must not be null', async () => {
      await expect(orm.UserLikesPost.create({ postId: post.id })).rejects.toThrowError();
    });
    test('postId must not be null', async () => {
      await expect(orm.UserLikesPost.create({ userId: user.id })).rejects.toThrowError();
    });
    test('create user likes post', async () => {
      await expect(
        orm.UserLikesPost.create({ postId: post.id, userId: user.id }),
      ).resolves.toBeInstanceOf(orm.UserLikesPost);
    });
  });
});
