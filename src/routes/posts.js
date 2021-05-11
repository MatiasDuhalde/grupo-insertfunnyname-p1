const KoaRouter = require('koa-router');
const { requireLogin, validateIntParam } = require('./utils/utils');
const { loadSinglePost, loadAllPostsPaged } = require('./utils/queries');
const { renderIndexPage, renderPostPage, renderPostEditPage } = require('./utils/render');

const router = new KoaRouter();

router.param('page', validateIntParam);
router.param('postId', validateIntParam);

router.get('posts.index', '/', loadAllPostsPaged, renderIndexPage);

router.get('posts.page', '/page/:page', loadAllPostsPaged, renderIndexPage);

router.get('posts.show', '/:postId', loadSinglePost, renderPostPage);

router.post('posts.create', '/', requireLogin, async (ctx) => {
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
  requireLogin,
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

router.patch('posts.patch', '/:postId/edit', requireLogin, loadSinglePost, async (ctx) => {
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

router.delete('posts.delete', '/:postId', requireLogin, loadSinglePost, async (ctx) => {
  if (ctx.state.currentUser.id !== ctx.state.post.userId) {
    ctx.status = 403;
    return ctx.throw(403, 'Forbidden');
  }
  ctx.state.post.destroy();
  return ctx.redirect('back');
});

router.post('posts.like', '/:postId/like', requireLogin, loadSinglePost, async (ctx) => {
  try {
    ctx.state.currentUser.addLikedPost(ctx.state.post);
    return ctx.redirect('back');
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    return ctx.redirect('back');
  }
});

router.post('posts.unlike', '/:postId/unlike', requireLogin, loadSinglePost, async (ctx) => {
  try {
    ctx.state.currentUser.removeLikedPost(ctx.state.post);
    return ctx.redirect('back');
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    return ctx.redirect('back');
  }
});

module.exports = router;
