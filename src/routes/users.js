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
    return next();
  },
  async (ctx, next) => {
    console.log('3');
    console.log('3');
    console.log('3');
    return next();
  },
  renderUserQueriedPostsPage,
  async (ctx, next) => {
    console.log('4');
    console.log('4');
    console.log('4');
    return next();
  },
);

// router.get('users.show.posts.page', '/:userId/posts/:page', loadCurrentUser, renderUserPage);

// router.get('users.show.liked', '/:userId/liked', loadCurrentUser, renderUserPage);

// router.get('users.show.liked.page', '/:userId/liked/:page', loadCurrentUser, renderUserPage);

module.exports = router;
