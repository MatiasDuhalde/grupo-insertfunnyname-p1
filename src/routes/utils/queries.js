const getSingleUser = async (ctx, userId) => ctx.orm.User.findByPk(userId);

const checkUserLikedPost = async (user, post) => user.hasLikedPost(post);

const checkUserLikedPosts = async (user, posts) => {
  const promises = posts.map((post) => checkUserLikedPost(user, post));
  return Promise.all(promises);
};

const loadCurrentUser = async (ctx, next) => {
  ctx.state.currentUser = await ctx.orm.User.findByPk(2);
  return next();
};

const loadSingleUser = async (ctx, next) => {
  const { userId } = ctx.params;
  ctx.state.user = await ctx.orm.User.findByPk(userId);
  if (!ctx.state.user) return ctx.redirect(ctx.router.url('posts.index'));
  return next();
};

const loadSinglePost = async (ctx, next) => {
  const { postId } = ctx.params;
  ctx.state.post = await ctx.orm.Post.findByPk(+postId, { include: ['User'] });
  if (!ctx.state.post) return ctx.redirect(ctx.router.url('posts.index'));
  return next();
};

module.exports = {
  checkUserLikedPost,
  checkUserLikedPosts,
  getSingleUser,
  loadCurrentUser,
  loadSingleUser,
  loadSinglePost,
};
