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

router.post('session.signup', '/signup', excludeLogin, async (ctx) => {
  const {
    firstName, //
    lastName,
    email,
    password,
  } = ctx.request.body;
  const hashedPassword = await ctx.orm.User.generateHash(password);
  let user;
  try {
    if (password.length < 6) {
      const validationError = new ctx.orm.Sequelize.ValidationError();
      const item = new ctx.orm.Sequelize.ValidationErrorItem(
        'Password is too short',
        'Validation error',
        'password',
        password,
      );
      validationError.errors.push(item);
      throw validationError;
    }
    user = await ctx.orm.User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
      avatarLink: 'https://png.pngtree.com/png-vector/20191026/ourlarge/pngtree-avatar-vector-icon-white-background-png-image_1870181.jpg',
      coverLink: 'https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg.webp',
    });
  } catch (validationError) {
    ctx.flashMessage.error = validationError.errors;
    return ctx.redirect('back');
  }
  ctx.session.currentUserId = user.id;
  return ctx.redirect(ctx.router.url('index.home'));
});

router.delete('session.logout', '/logout', requireLogin, async (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('index.home'));
});

module.exports = router;
