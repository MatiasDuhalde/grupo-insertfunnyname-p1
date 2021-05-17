const KoaRouter = require('koa-router');
const { renderAboutPage } = require('./utils/render');

const router = new KoaRouter();

router.get('index.home', '/', (ctx) => {
  ctx.redirect(ctx.router.url('posts.index'));
});

router.get('index.about', '/about', renderAboutPage);

module.exports = router;
