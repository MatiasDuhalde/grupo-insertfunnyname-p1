const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('post', '/', async (ctx) => {
  await ctx.render('post/index', {});
});

module.exports = router;
