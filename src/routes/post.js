const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const posts = await ctx.orm.Post.findAll({ limit: 20 });
  await ctx.render('index', { posts });
});

module.exports = router;
