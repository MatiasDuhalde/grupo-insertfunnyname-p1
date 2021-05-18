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
    ctx.session.currentUserId = user.id;
    ctx.redirect(ctx.router.url('index.home'));
  } else {
    ctx.flashMessage.danger = { login: 'Incorrect email or password' };
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
  let user;
  try {
    const hashedPassword = await ctx.orm.User.generateHash(password);
    user = await ctx.orm.User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
      avatarLink:
        'https://png.pngtree.com/png-vector/20191026/ourlarge/pngtree-avatar-vector-icon-white-background-png-image_1870181.jpg',
      coverLink: 'https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg.webp',
    });
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
