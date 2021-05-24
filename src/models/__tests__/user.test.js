const orm = require('..');
const { test } = require('../../config/database');

describe('user model', () => {
  beforeAll(async () => {
    await orm.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });
  
  const userData = {
    firstName: 'John',
    lastName: 'Web',
    email: 'user@example.org',
    hashedPassword: '123457',
    avatarLink: '',
    coverLink: '',
  };

  describe('Create User', () => {
    test('password must have a minimum length of 6 characters', async () => {
        const password = {}
        expect(orm.User.generateHash(password)).toThrowError('Password must be at least 6 characters');
      });
  });
});