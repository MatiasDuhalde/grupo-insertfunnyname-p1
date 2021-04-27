const getSingleUser = async (ctx, userId) => ctx.orm.User.findByPk(userId);

const getPostUser = async (ctx, post) => getSingleUser(ctx, post.userId);

const getPostsUsers = async (ctx, posts) => {
  const promises = [];
  posts.forEach((post) => {
    promises.push(getPostUser(ctx, post));
  });
  const usersArray = await Promise.all(promises);
  const users = usersArray.reduce((obj, cur) => ({ ...obj, [cur.id]: cur }), {});
  return users;
};

const loadCurrentUser = async (ctx, next) => {
  ctx.state.currentUser = await ctx.orm.User.findByPk(2);
  return next();
};

const loadSinglePost = async (ctx, next) => {
  const { postId } = ctx.params;
  ctx.state.post = await ctx.orm.Post.findByPk(+postId);
  if (!ctx.state.post) return ctx.redirect(ctx.router.url('posts.index'));
  return next();
};

module.exports = {
  getPostUser,
  getPostsUsers,
  getSingleUser,
  loadCurrentUser,
  loadSinglePost,
};
