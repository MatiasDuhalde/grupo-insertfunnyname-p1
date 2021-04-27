const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadDummyUser, loadSinglePost } = require('./utils/queries');
const { renderIndexPage, renderPostPage, renderPostEditPage } = require('./utils/render');

const router = new KoaRouter();

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
  renderIndexPage,
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
  renderIndexPage,
);

router.get('posts.show', '/:postId', loadDummyUser, loadSinglePost, renderPostPage);

router.post('posts.create', '/', loadDummyUser, async (ctx) => {
  try {
    const { imageLink, body } = ctx.request.body;
    const userId = ctx.state.currentUser.id;
    ctx.orm.Post.create({ imageLink, body, userId });
    return ctx.redirect(ctx.router.url('posts.index'));
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    // TODO: Process error
    return ctx.redirect(ctx.router.url('posts.index'));
  }
});

router.get(
  'posts.edit',
  '/:postId/edit',
  loadDummyUser,
  loadSinglePost,
  async (ctx, next) => {
    if (ctx.state.currentUser.id !== ctx.state.post.userId) {
      ctx.status = 401;
      return ctx.throw(401, 'Unauthorized');
    }
    return next();
  },
  renderPostEditPage,
);

router.patch('posts.patch', '/:postId/edit', loadDummyUser, loadSinglePost, async (ctx) => {
  try {
    if (ctx.state.currentUser.id !== ctx.state.post.userId) {
      ctx.status = 401;
      return ctx.throw(401, 'Unauthorized');
    }
    const { imageLink, body } = ctx.request.body;
    ctx.state.post.imageLink = imageLink;
    ctx.state.post.body = body;
    await ctx.state.post.save();
    return ctx.redirect(ctx.router.url('posts.index'));
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    // TODO: Process error
    return ctx.redirect(ctx.router.url('posts.index'));
  }
});

router.delete('posts.delete', '/:postId', loadDummyUser, loadSinglePost, async (ctx) => {
  if (ctx.state.currentUser.id !== ctx.state.post.userId) {
    ctx.status = 401;
    return ctx.throw(401, 'Unauthorized');
  }
  ctx.state.post.destroy();
  return ctx.redirect('back');
});

module.exports = router;
