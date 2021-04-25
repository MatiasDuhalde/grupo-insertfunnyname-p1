const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.redirect('/', 'posts.index');

module.exports = router;
