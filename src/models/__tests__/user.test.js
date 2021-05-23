const orm = require('..');

describe('user model', () => {
  beforeAll(async () => {
    await orm.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });
  
  const nono_password = '12345';

  describe('dummyUser', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Web',
      email: 'user@example.org',
      hashedPassword: '123457',
      avatarLink: '',
      coverLink: '',
    };

    beforeAll(async () => {
      await orm.User.create(userData);
    });

    test('password must have a minimum length of 6 characters', async () => {
      const { password, email } = userData;
      const user = await orm.user.findOne({ where: { email } });
      expect(user.generateHash(password)).toThrowError('Password must be at least 6 characters');
    });
  });
});