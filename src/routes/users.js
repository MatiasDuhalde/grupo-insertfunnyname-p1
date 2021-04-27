const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadCurrentUser, loadSingleUser } = require('./utils/queries');
const { renderUserPage, renderUserQueriedPostsPage } = require('./utils/render');

const router = new KoaRouter();

router.param('userId', validateIntParam);
router.param('page', validateIntParam);

router.get('users.show', '/:userId', loadCurrentUser, renderUserPage);

router.get(
  'users.show.posts',
  '/:userId/posts',
  loadCurrentUser,
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'created';
    ctx.state.posts = await ctx.state.user.getPosts({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: 'User',
    });
    return next();
  },
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.posts.page',
  '/:userId/posts/:page',
  loadCurrentUser,
  loadSingleUser,
  async (ctx, next) => {
    const { page } = ctx.params;
    ctx.state.pageAction = 'created';
    ctx.state.posts = await ctx.state.user.getPosts({
      offset: (page - 1) * 20,
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: 'User',
    });
    return next();
  },
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.liked',
  '/:userId/liked',
  loadCurrentUser,
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'liked';
    ctx.state.posts = await ctx.state.user.getLikedPosts({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: ['User'],
    });
    return next();
  },
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.liked.page',
  '/:userId/liked/:page',
  loadCurrentUser,
  loadSingleUser,
  async (ctx, next) => {
    const { page } = ctx.params;
    ctx.state.pageAction = 'liked';
    ctx.state.posts = await ctx.state.user.getLikedPosts({
      offset: (page - 1) * 20,
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: ['User'],
    });
    return next();
  },
  renderUserQueriedPostsPage,
);

module.exports = router;
