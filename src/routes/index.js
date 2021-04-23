const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const _ = require('lodash');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const posts = await ctx.orm.Post.findAll({
    limit: 20,
    order: [['createdAt', 'DESC']],
  });
  const users = {};
  for (const post of posts) {
    const user = await ctx.orm.User.findOne({ where: { id: post.userId } });
    users[user.id] = user;
  }
  await ctx.render('index', { posts, users });
});

router.get('/:page', async (ctx) => {
  const { page } = ctx.params;
  const posts = await ctx.orm.Post.findAll({
    offset: page * 20,
    limit: page * 20,
  });
  await ctx.render('index', { posts });
});

module.exports = router;
