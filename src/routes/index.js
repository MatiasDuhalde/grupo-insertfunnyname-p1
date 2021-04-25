const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', (ctx) => {
  ctx.redirect(ctx.router.url('posts.index'));
});

module.exports = router;
