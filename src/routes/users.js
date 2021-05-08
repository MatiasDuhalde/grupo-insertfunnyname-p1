const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadCurrentUser, loadSingleUser, loadAllUserPostsPaged } = require('./utils/queries');
const { renderUserPage, renderUserQueriedPostsPage } = require('./utils/render');

const router = new KoaRouter();

router.param('userId', validateIntParam);
router.param('page', validateIntParam);

router.get('users.show', '/:userId', loadCurrentUser, loadSingleUser, renderUserPage);

router.get(
  'users.show.posts',
  '/:userId/posts',
  loadCurrentUser,
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
  loadCurrentUser,
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
  loadCurrentUser,
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
  loadCurrentUser,
  loadSingleUser,
  async (ctx, next) => {
    ctx.state.pageAction = 'liked';
    return next();
  },
  loadAllUserPostsPaged,
  renderUserQueriedPostsPage,
);

module.exports = router;
