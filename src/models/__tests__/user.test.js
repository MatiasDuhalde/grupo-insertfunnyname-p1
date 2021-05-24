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

  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('create user', () => {
    test('firstName must be not empty', async () => {
      const newData = { ...sampleUserData, firstName: '' };
      await expect(() => orm.User.create(newData)).rejects.toThrowError(
        "First name can't be empty",
      );
    });
    test('lastName must be not empty', async () => {
      const newData = { ...sampleUserData, lastName: '' };
      await expect(() => orm.User.create(newData)).rejects.toThrowError("Last name can't be empty");
    });
    test('password must have a minimum length of 6 characters', async () => {
      expect(() => orm.User.generateHash('12345')).toThrowError(
        'Password must be at least 6 characters',
      );
    });
    test('create user', async () => {
      await expect(orm.User.create(sampleUserData)).resolves.toBeInstanceOf(orm.User);
    });
  });
});
