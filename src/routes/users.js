const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadSingleUser, loadAllUserPostsPaged } = require('./utils/queries');
const { renderUserPage, renderUserQueriedPostsPage } = require('./utils/render');

const router = new KoaRouter();

router.param('userId', validateIntParam);
router.param('page', validateIntParam);

router.get('users.show', '/:userId', loadSingleUser, renderUserPage);

router.get(
  'users.show.posts',
  '/:userId/posts',
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'created';
    return next();
  },
  loadAllUserPostsPaged,
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.posts.page',
  '/:userId/posts/:page',
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'created';
    return next();
  },
  loadAllUserPostsPaged,
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.liked',
  '/:userId/liked',
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'liked';
    return next();
  },
  loadAllUserPostsPaged,
  renderUserQueriedPostsPage,
);

router.get(
  'users.show.liked.page',
  '/:userId/liked/:page',
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'liked';
    return next();
  },
  loadAllUserPostsPaged,
  renderUserQueriedPostsPage,
);

module.exports = router;
