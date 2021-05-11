const KoaRouter = require('koa-router');
const { excludeLogin, requireLogin } = require('./utils/utils');
const { getUserByEmail } = require('./utils/queries');
const { renderLoginPage, renderSignupPage } = require('./utils/render');

const router = new KoaRouter();

router.get('session.login-form', '/login', excludeLogin, renderLoginPage);

router.post('session.login', '/login', excludeLogin, async (ctx, next) => {
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

router.get('session.signup-form', '/signup', excludeLogin, renderSignupPage);

router.post('session.signup', '/signup', excludeLogin, async (ctx, next) => {
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

router.delete('session.logout', '/logout', requireLogin, async (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('index.home'));
});

module.exports = router;
