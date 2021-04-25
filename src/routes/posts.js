const KoaRouter = require('koa-router');
const { render } = require('node-sass');
const { validate } = require('webpack');

const router = new KoaRouter();

async function getPostsUsers(ctx, posts) {
  const users = {};
  for (const post of posts) {
    if (users[post.userId] === undefined) {
      const user = await ctx.orm.User.findByPk(post.userId);
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
  ctx.state.user = await ctx.orm.User.findByPk(202);
  return next();
}

async function renderIndexPage(ctx) {
  const users = await getPostsUsers(ctx, ctx.state.posts);
  await ctx.render('index', {
    posts: ctx.state.posts,
    users,
    createPostPath: ctx.router.url('posts.create'),
    deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
    showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
    showUserPath: ctx.router.url('users.show'),
  });
}

async function renderPostPage(ctx) {
  const users = await getPostsUsers(ctx, ctx.state.posts);
  await ctx.render('posts/show', {});
}

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

router.param('page', validateIntParam).get(
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

router.param('postId', validateIntParam).get(
  'posts.show',
  '/:postId',
  loadDummyUser,
  async (ctx, next) => {
    return next();
  },
  renderPostPage
);

router.post('posts.create', '/', loadDummyUser, async (ctx) => {
  try {
    const { imageLink, body } = ctx.request.body;
    const userId = ctx.state.user.id;
    const post = ctx.orm.Post.create({ imageLink, body, userId });
    ctx.redirect(ctx.router.url('posts.index'));
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
  }
});

router
  .param('postId', validateIntParam)
  .delete('posts.delete', '/:postId', loadDummyUser, async (ctx) => {
    const { postId } = ctx.params;
    postId = parseInt(postId);
    const post = await ctx.orm.Post.findByPk(postId);
    if (ctx.state.user.id === post.userId) {
      post.destroy();
      ctx.redirect(ctx.router.url('posts.page', { page: ctx.params.page }));
    }
  });

module.exports = router;
