const KoaRouter = require('koa-router');
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

async function loadDummyUser(ctx, next) {
  ctx.state.user = await ctx.orm.User.findByPk(201);
  next();
}

router.get('posts.index', '/', async (ctx) => {
  const posts = await ctx.orm.Post.findAll({
    limit: 20,
    order: [['createdAt', 'DESC']],
  });
  const users = await getPostsUsers(ctx, posts);
  await ctx.render('index', { posts, users });
});

router
  .param('page', (page, ctx, next) => {
    page = parseInt(page);
    if (page < 1 || isNaN(page)) return (ctx.status = 404);
    return next();
  })
  .get('posts.page', '/:page', async (ctx) => {
    const { page } = ctx.params;
    const posts = await ctx.orm.Post.findAll({
      offset: (page - 1) * 20,
      limit: 20,
      order: [['createdAt', 'DESC']],
    });
    const users = await getPostsUsers(ctx, posts);
    await ctx.render('index', { posts, users });
  });

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

module.exports = router;
