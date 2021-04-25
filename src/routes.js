const KoaRouter = require('koa-router');

const index = require('./routes/index');
const profile = require('./routes/profile');
const posts = require('./routes/posts');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/profile', profile.routes());
router.use('/posts', posts.routes());

module.exports = router;
