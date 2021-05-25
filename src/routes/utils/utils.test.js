const orm = require('../../models');
const { requireLogin, excludeLogin, validateIntParam } = require('./utils');

describe('test utils', () => {
  const ctx = { orm };

  const sampleUserData = {
    firstName: 'John',
    lastName: 'Web',
    email: 'user@example.org',
    password: '12345678',
    avatarLink: 'https://cdn.fakercloud.com/avatars/tgerken_128.jpg',
    coverLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
  };

  let user;

  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true });
    user = await orm.User.create(sampleUserData);
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('user session validators', () => {
    beforeAll(async () => {
      ctx.state = {};
      ctx.router = {
        url: jest.fn(),
      };
    });

    describe('excludeLogin', () => {
      beforeEach(async () => {
        ctx.state = {};
        ctx.redirect = jest.fn();
      });
      test("don't redirect if excludeLogin and no current user", async () => {
        await excludeLogin(ctx, () => {});
        expect(ctx.redirect).not.toHaveBeenCalled();
      });
      test('redirect if excludeLogin and current user', async () => {
        ctx.state.currentUser = user;
        await excludeLogin(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
    });

    describe('requireLogin', () => {
      beforeEach(async () => {
        ctx.state = {};
        ctx.redirect = jest.fn();
      });
      test('redirect if requireLogin and no current user', async () => {
        await requireLogin(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
      test("don't redirect if requireLogin and current user", async () => {
        ctx.state.currentUser = user;
        await requireLogin(ctx, () => {});
        expect(ctx.redirect).not.toHaveBeenCalled();
      });
    });
  });

  describe('validateIntParam', () => {
    beforeEach(async () => {
      ctx.throw = jest.fn();
    });
    test('numeric str param', async () => {
      await validateIntParam('123', ctx, () => {});
      expect(ctx.throw).not.toHaveBeenCalled();
    });
    test('int param', async () => {
      await validateIntParam(123, ctx, () => {});
      expect(ctx.throw).not.toHaveBeenCalled();
    });
    test('non-numeric str param', async () => {
      await validateIntParam('hola', ctx, () => {});
      expect(ctx.throw).toHaveBeenCalled();
    });
  });
});
