const KoaRouter = require('koa-router');
const { validateIntParam, requireLogin } = require('./utils/utils');
const { loadSingleUser, loadAllUserPostsPaged } = require('./utils/queries');
const {
  renderUserPage,
  renderUserEditPage,
  renderUserQueriedPostsPage,
} = require('./utils/render');

const router = new KoaRouter();

router.param('userId', validateIntParam);
router.param('page', validateIntParam);

router.get('users.show', '/:userId', loadSingleUser, renderUserPage);

router.get(
  'users.edit',
  '/:userId/edit',
  requireLogin,
  loadSingleUser,
  async (ctx, next) => {
    if (ctx.state.currentUser.id !== ctx.state.user.id) {
      ctx.status = 403;
      return ctx.throw(403, 'Forbidden');
    }
    return next();
  },
  renderUserEditPage,
);

router.patch('users.patch', '/:userId/edit', requireLogin, loadSingleUser, async (ctx) => {
  try {
    if (ctx.state.currentUser.id !== ctx.state.user.id) {
      ctx.status = 403;
      return ctx.throw(403, 'Forbidden');
    }
    const {
      firstName, //
      lastName,
      avatarLink,
      coverLink,
      password,
    } = ctx.request.body;
    ctx.state.user.firstName = firstName;
    ctx.state.user.lastName = lastName;
    ctx.state.user.avatarLink = avatarLink;
    ctx.state.user.coverLink = coverLink;
    if (password) {
      const hashedPassword = await ctx.orm.User.generateHash(password);
      ctx.state.user.hashedPassword = hashedPassword;
    }
    await ctx.state.user.save();
    return ctx.redirect(ctx.router.url('users.show', { userId: ctx.state.user.id }));
  } catch (err) {
    const messages = {};
    if (err instanceof ctx.orm.Sequelize.ValidationError) {
      err.errors.forEach((errorItem) => {
        messages[errorItem.path] = errorItem.message;
      });
    } else {
      messages.password = err.message;
    }
    ctx.flashMessage.danger = messages;
    return ctx.redirect(ctx.router.url('users.edit', { userId: ctx.state.user.id }));
  }
});

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
