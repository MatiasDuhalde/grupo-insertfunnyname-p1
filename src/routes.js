const KoaRouter = require('koa-router');

const index = require('./routes/index');
const profile = require('./routes/users');
const posts = require('./routes/posts');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/users', profile.routes());
router.use('/posts', posts.routes());

module.exports = router;
