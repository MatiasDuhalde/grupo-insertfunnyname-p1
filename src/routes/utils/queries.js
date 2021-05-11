const getSingleUser = async (ctx, userId) => ctx.orm.User.findByPk(userId);

const getUserByEmail = async (ctx, email) => ctx.orm.User.findOne({ where: { email } });

const checkUserLikedPost = async (user, post) => user.hasLikedPost(post);

const checkUserLikedPosts = async (user, posts) => {
  const promises = posts.map((post) => checkUserLikedPost(user, post));
  return Promise.all(promises);
};

const checkPostLikeCount = async (post) => post.countLikedPosts();

const checkPostsLikeCount = async (posts) => {
  const promises = posts.map((post) => checkPostLikeCount(post));
  return Promise.all(promises);
};

const loadCurrentUser = async (ctx, next) => {
  const { currentUserId } = ctx.session;
  if (currentUserId !== undefined) {
    ctx.state.currentUser = await ctx.orm.User.findByPk(currentUserId);
  } else {
    ctx.state.currentUser = null;
  }
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
  ctx.state.post = await ctx.orm.Post.findByPk(+postId, {
    include: [
      {
        model: ctx.orm.User,
      },
    ],
  });
  if (!ctx.state.post) return ctx.redirect(ctx.router.url('posts.index'));
  return next();
};

const loadAllPostsPaged = async (ctx, next) => {
  const { page } = ctx.params;
  const offset = page ? (page - 1) * 20 : 0;
  ctx.state.posts = await ctx.orm.Post.findAll({
    offset,
    limit: 20,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: ctx.orm.User,
      },
    ],
  });
  ctx.state.hasNextPage = (await ctx.orm.Post.count()) > offset + 20;
  return next();
};

const loadAllUserPostsPaged = async (ctx, next) => {
  const { page } = ctx.params;
  const offset = page ? (page - 1) * 20 : 0;
  const queryConfig = {
    offset,
    limit: 20,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: ctx.orm.User,
      },
    ],
  };
  switch (ctx.state.pageAction) {
    case 'created':
      ctx.state.posts = await ctx.state.user.getPosts(queryConfig);
      ctx.state.hasNextPage = (await ctx.state.user.countPosts()) > offset + 20;
      break;
    case 'liked':
      ctx.state.posts = await ctx.state.user.getLikedPosts(queryConfig);
      ctx.state.hasNextPage = (await ctx.state.user.countLikedPosts()) > offset + 20;
      break;
    default:
      break;
  }
  return next();
};

module.exports = {
  checkUserLikedPost,
  checkUserLikedPosts,
  checkPostLikeCount,
  checkPostsLikeCount,
  getSingleUser,
  getUserByEmail,
  loadCurrentUser,
  loadSingleUser,
  loadSinglePost,
  loadAllPostsPaged,
  loadAllUserPostsPaged,
};
