const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const profile = require('./routes/profile');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/profile', profile.routes());

module.exports = router;
