const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users.show', '/', async (ctx) => {
  await ctx.render('profile/index', {});
});

module.exports = router;
