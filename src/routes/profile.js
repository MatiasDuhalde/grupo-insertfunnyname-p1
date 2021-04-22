const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('profile', '/', async (ctx) => {
  await ctx.render('profile/index', {});
});

module.exports = router;
