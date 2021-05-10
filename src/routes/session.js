const KoaRouter = require('koa-router');
const { loadCurrentUser, getUserByEmail } = require('./utils/queries');
const { renderLoginPage, renderSignupPage } = require('./utils/render');

const router = new KoaRouter();

router.get(
  'session.login-form',
  '/login',
  async (ctx, next) => {
    if (ctx.state.currentUser) {
      return ctx.redirect(ctx.router.url('index.home'));
    }
    return next();
  },
  renderLoginPage,
);

router.post('session.login', '/login', async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const user = await getUserByEmail(ctx, email);
  if (user && (await user.validatePassword(password))) {
    // TODO: Encrypt user.id in cookie (use crypto module)
    ctx.session.currentUserId = user.id;
    ctx.redirect(ctx.router.url('index.home'));
  } else {
    // TODO: Add error message
    ctx.redirect(ctx.router.url('session.login-form'));
  }
  return next();
});

router.get(
  'session.signup-form',
  '/signup',
  async (ctx, next) => {
    if (ctx.state.currentUser) {
      return ctx.redirect(ctx.router.url('index.home'));
    }
    return next();
  },
  renderSignupPage,
);

router.post('session.signup', '/signup', async (ctx, next) => {
  const { firstName, lastName, email, password } = ctx.request.body;
  // const user = await getUserByEmail(email);

  // if (user) {
  //   ctx.session.currentUserId = user.id;
  //   ctx.redirect(ctx.router.url('index.home'));
  // } else {
  //   ctx.redirect(ctx.router.url('session.login-form'));
  // }

  return next();
});

router.get('session.logout', '/logout', async (ctx) => {
  ctx.redirect(ctx.router.url('index.home'));
});

module.exports = router;
