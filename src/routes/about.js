const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('index.home', '/', (ctx) => {
  ctx.redirect(ctx.router.url('posts.index'));
});

module.exports = router;
