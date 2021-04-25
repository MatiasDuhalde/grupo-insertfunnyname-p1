const KoaRouter = require('koa-router');
const { render } = require('node-sass');
const { validate } = require('webpack');

const router = new KoaRouter();

async function getPostUser(ctx, post) {
  return await ctx.orm.User.findByPk(post.userId);
}

async function getPostsUsers(ctx, posts) {
  const users = {};
  for (const post of posts) {
    if (users[post.userId] === undefined) {
      const user = await getPostUser(ctx, post);
      users[user.id] = user;
    }
  }
  return users;
}

async function validateIntParam(param, ctx, next) {
  param = parseInt(param);
  if (param < 1 || isNaN(param)) return (ctx.status = 404);
  return next();
}

async function loadDummyUser(ctx, next) {
  ctx.state.currentUser = await ctx.orm.User.findByPk(201);
  return next();
}

async function loadSinglePost(ctx, next) {
  const { postId } = ctx.params;
  ctx.state.post = await ctx.orm.Post.findByPk(parseInt(postId));
  if (!ctx.state.post) return ctx.redirect(ctx.router.url('posts.index'));
  return next();
}

async function renderIndexPage(ctx) {
  const users = await getPostsUsers(ctx, ctx.state.posts);
  await ctx.render('index', {
    currentUser: ctx.state.currentUser,
    posts: ctx.state.posts,
    users,
    page: parseInt(ctx.params.page) || 1,
    createPostPath: ctx.router.url('posts.create'),
    deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
    showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
    editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
    showUserPath: ctx.router.url('users.show'),
    nextPagePath: (page) => ctx.router.url('posts.page', { page }),
  });
}

async function renderPostPage(ctx) {
  const user = await getPostUser(ctx, ctx.state.post);
  await ctx.render('posts/show', {
    currentUser: ctx.state.currentUser,
    post: ctx.state.post,
    user,
    deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
    showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
    editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
    showUserPath: ctx.router.url('users.show'),
  });
}

router.param('page', validateIntParam);
router.param('postId', validateIntParam);

router.get(
  'posts.index',
  '/',
  loadDummyUser,
  async (ctx, next) => {
    ctx.state.posts = await ctx.orm.Post.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
    });
    return next();
  },
  renderIndexPage
);

router.get(
  'posts.page',
  '/page/:page',
  loadDummyUser,
  async (ctx, next) => {
    const { page } = ctx.params;
    ctx.state.posts = await ctx.orm.Post.findAll({
      offset: (page - 1) * 20,
      limit: 20,
      order: [['createdAt', 'DESC']],
    });
    return next();
  },
  renderIndexPage
);

router.get(
  'posts.show',
  '/:postId',
  loadDummyUser,
  loadSinglePost,
  renderPostPage
);

router.post('posts.create', '/', loadDummyUser, async (ctx) => {
  try {
    const { imageLink, body } = ctx.request.body;
    const userId = ctx.state.currentUser.id;
    const post = ctx.orm.Post.create({ imageLink, body, userId });
    ctx.redirect(ctx.router.url('posts.index'));
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
  }
});

router.get(
  'posts.edit',
  '/:postId/edit',
  loadDummyUser,
  loadSinglePost,
  async (ctx) => {
    if (ctx.state.currentUser.id !== ctx.state.post.userId) {
      return (ctx.status = 404);
    }
    await ctx.render('posts/edit', {
      post: ctx.state.post,
      patchPostPath: (postId) => ctx.router.url('posts.patch', { postId }),
    });
  }
);

router.patch(
  'posts.patch',
  '/:postId/edit',
  loadDummyUser,
  loadSinglePost,
  async (ctx) => {
    try {
      if (ctx.state.currentUser.id !== ctx.state.post.userId) {
        return (ctx.status = 404);
      }
      const { imageLink, body } = ctx.request.body;
      ctx.state.post.imageLink = imageLink;
      ctx.state.post.body = body;
      await ctx.state.post.save();
      ctx.redirect(ctx.router.url('posts.index'));
    } catch (validationError) {
      ctx.flashMessage.error = validationError.errors;
    }
  }
);

router.delete(
  'posts.delete',
  '/:postId',
  loadDummyUser,
  loadSinglePost,
  async (ctx) => {
    if (ctx.state.currentUser.id === ctx.state.post.userId) {
      ctx.state.post.destroy();
      ctx.redirect('back');
    }
  }
);

module.exports = router;
