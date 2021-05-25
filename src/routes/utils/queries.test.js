const orm = require('../../models');
const {
  loadCurrentUser,
  loadSingleUser,
  loadSinglePost,
  loadAllPostsPaged,
  loadAllUserPostsPaged,
} = require('./queries');

describe('test queries', () => {
  const ctx = { orm };

  const sampleUserData = {
    firstName: 'John',
    lastName: 'Web',
    email: 'user@example.org',
    password: '12345678',
    avatarLink: 'https://cdn.fakercloud.com/avatars/tgerken_128.jpg',
    coverLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
  };
  const samplePostData = {
    imageLink: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg',
    body: 'Insert Funny Name test with Nicolas Cage',
  };

  let user;
  let posts;
  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true });
    user = await orm.User.create(sampleUserData);
    samplePostData.userId = user.id;
    const promises = [];
    for (let i = 0; i < 6; i += 1) promises.push(orm.Post.create(samplePostData));
    posts = await Promise.all(promises);
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('userId exists inside ctx.params', () => {
    beforeAll(async () => {
      ctx.state = {};
    });

    describe('loadCurrentUser', () => {
      test('loads current user with valid id in session', async () => {
        ctx.session = { currentUserId: user.id };
        await loadCurrentUser(ctx, () => {});
        expect(ctx.state.currentUser.toJSON()).toEqual(user.toJSON());
      });
      test('loads current user with no id in session', async () => {
        ctx.session = {};
        await loadCurrentUser(ctx, () => {});
        expect(ctx.state.currentUser).toEqual(null);
      });
      test('loads current user with invalid id in session', async () => {
        ctx.session = { currentUserId: 12345 };
        await loadCurrentUser(ctx, () => {});
        expect(ctx.state.currentUser).toEqual(null);
      });
    });

    describe('loadSingleUser', () => {
      beforeEach(async () => {
        ctx.redirect = jest.fn();
        ctx.router = { url: jest.fn() };
        ctx.state = {};
      });
      test('load single user with valid id in params', async () => {
        ctx.params = { userId: user.id };
        await loadSingleUser(ctx, () => {});
        expect(ctx.state.user.toJSON()).toEqual(user.toJSON());
      });
      test('load single user with no id in params', async () => {
        ctx.params = {};
        await loadSingleUser(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
      test('load single user with invalid id in params', async () => {
        ctx.params = { userId: 12345 };
        await loadSingleUser(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
    });
  });

  describe('postId exists inside ctx.params', () => {
    beforeAll(async () => {
      ctx.state = {};
    });

    describe('loadSinglePost', () => {
      beforeEach(async () => {
        ctx.redirect = jest.fn();
        ctx.router = { url: jest.fn() };
        ctx.state = {};
      });
      test('load a single post with valid id in params', async () => {
        ctx.params = { postId: posts[0].id };
        await loadSinglePost(ctx, () => {});
        const statePost = ctx.state.post.toJSON();
        delete statePost.User;
        expect(statePost).toEqual(posts[0].toJSON());
      });
      test('load a single post with no id in params', async () => {
        ctx.params = {};
        await loadSinglePost(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
      test('load a single post with invalid id in params', async () => {
        ctx.params = { postId: 12345 };
        await loadSinglePost(ctx, () => {});
        expect(ctx.redirect).toHaveBeenCalled();
      });
    });
  });

  describe('load multiple posts', () => {
    beforeEach(async () => {
      ctx.state = {};
    });

    const sortingFunction = (a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    };

    test('loadAllPosts', async () => {
      await loadAllPostsPaged(ctx, () => {});
      const queriedPosts = ctx.state.posts;
      queriedPosts.sort(sortingFunction);
      posts.sort(sortingFunction);

      posts.forEach((currentPost, index) => {
        const currentQueriedPost = queriedPosts[index].toJSON();
        delete currentQueriedPost.User;
        expect(currentPost.toJSON()).toEqual(currentQueriedPost);
      });
    });
    test('loadAllUserPosts (created)', async () => {
      ctx.state.user = user;
      ctx.state.pageAction = 'created';
      await loadAllUserPostsPaged(ctx, () => {});
      const queriedPosts = ctx.state.posts;
      queriedPosts.sort(sortingFunction);
      posts.sort(sortingFunction);

      posts.forEach((currentPost, index) => {
        const currentQueriedPost = queriedPosts[index].toJSON();
        delete currentQueriedPost.User;
        expect(currentPost.toJSON()).toEqual(currentQueriedPost);
      });
    });
  });
});
