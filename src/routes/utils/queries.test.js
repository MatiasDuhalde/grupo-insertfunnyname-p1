const orm = require('../../models');
const { loadCurrentUser } = require('./queries');
const { loadSingleUser } = require('./queries');
const { loadSinglePost } = require('./queries');
const { loadAllPostsPaged } = require('./queries');

describe('getAuthor middleware', () => {
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
    imageLink: 'https://picsum.photos/seed/0.8774069009477856/1000/500',
    body: 'Insert Funny Name test',
  };
  const samplePostData2 = {
    imageLink: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg',
    body: 'Insert Funny Name test with Nicolas Cage',
  };
  
  let user;
  let post;
  let post2;
  
  beforeAll(async () => {
    sampleUserData.hashedPassword = await orm.User.generateHash('12345678');
    await orm.sequelize.sync({ force: true }); 
    user = await orm.User.create(sampleUserData);
    samplePostData.userId = user.id;
    post = await orm.Post.create(samplePostData);
    samplePostData2.userId = user.id;
    post2 = await orm.Post.create(samplePostData2);
  });

  afterAll(async () => {
    await orm.sequelize.close();
  });

  describe('userId exists inside ctx.params', () => {

    beforeAll(async () => {
      ctx.params = {
        currentUserId: user.id,
        userId: user.id,
      };
      ctx.state = {};
    });

    test('sets ctx.state.user with loading the current user', async () => {
      await expect(loadCurrentUser(ctx, () => {})).rejects.toThrowError();
    });
    test('sets ctx.state.user with loading single user', async () => {
      await loadSingleUser(ctx, () => {});
      expect(ctx.state.user.toJSON()).toEqual(user.toJSON());
    });
  });
  describe('postId exists inside ctx.params', () => {

    beforeAll(async () => {
      ctx.params = {
        postId: post.id,
      };
      ctx.state = {};
    });
    test('load a single post', async () => {
      await loadSinglePost(ctx, () => {});
      let statePost = ctx.state.post.toJSON();
      delete statePost.User;
      expect(statePost).toEqual(post.toJSON());
    });
    test('load all posts', async () => {
      await loadAllPostsPaged(ctx, () => {});
      //let statePosts = ctx.state.posts.toJSON();
      console.log(ctx.state.posts);
      delete statePosts.User;
      expect(statePosts).toEqual(post.toJSON());
    });
  });
});
