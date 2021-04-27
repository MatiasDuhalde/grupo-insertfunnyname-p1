const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadCurrentUser, loadSinglePost } = require('./utils/queries');
const { renderIndexPage, renderPostPage, renderPostEditPage } = require('./utils/render');

const router = new KoaRouter();

router.param('page', validateIntParam);
router.param('postId', validateIntParam);

router.get(
  'posts.index',
  '/',
  loadCurrentUser,
  async (ctx, next) => {
    ctx.state.posts = await ctx.orm.Post.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: ['User'],
    });
    return next();
  },
  renderIndexPage,
);

router.get(
  'posts.page',
  '/page/:page',
  loadCurrentUser,
  async (ctx, next) => {
    const { page } = ctx.params;
    ctx.state.posts = await ctx.orm.Post.findAll({
      offset: (page - 1) * 20,
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: ['User'],
    });
    return next();
  },
  renderIndexPage,
);

router.get('posts.show', '/:postId', loadCurrentUser, loadSinglePost, renderPostPage);

router.post('posts.create', '/', loadCurrentUser, async (ctx) => {
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
  loadCurrentUser,
  loadSinglePost,
  async (ctx, next) => {
    if (ctx.state.currentUser.id !== ctx.state.post.userId) {
      ctx.status = 403;
      return ctx.throw(403, 'Forbidden');
    }
    return next();
  },
  renderPostEditPage,
);

router.patch('posts.patch', '/:postId/edit', loadCurrentUser, loadSinglePost, async (ctx) => {
  try {
    if (ctx.state.currentUser.id !== ctx.state.post.userId) {
      ctx.status = 403;
      return ctx.throw(403, 'Forbidden');
    }
    const { imageLink, body } = ctx.request.body;
    ctx.state.post.imageLink = imageLink;
    ctx.state.post.body = body;
    await ctx.state.post.save();
    return ctx.redirect(ctx.router.url('posts.show', { postId: ctx.state.post.id }));
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    // TODO: Process error
    return ctx.redirect(ctx.router.url('posts.edit', { postId: ctx.state.post.id }));
  }
});

router.delete('posts.delete', '/:postId', loadCurrentUser, loadSinglePost, async (ctx) => {
  if (ctx.state.currentUser.id !== ctx.state.post.userId) {
    ctx.status = 403;
    return ctx.throw(403, 'Forbidden');
  }
  ctx.state.post.destroy();
  return ctx.redirect('back');
});

module.exports = router;
