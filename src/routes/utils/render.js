const {
  checkUserLikedPost,
  checkUserLikedPosts,
  checkPostLikeCount,
  checkPostsLikeCount,
  getRandomPost,
  getRandomPosts,
} = require('./queries');

const createConf = (ctx, args) => ({
  userIsLoggedIn: Boolean(ctx.state.currentUser),
  currentUser: ctx.state.currentUser,
  loginPath: ctx.router.url('session.login'),
  signupPath: ctx.router.url('session.signup'),
  logoutPath: ctx.router.url('session.logout'),
  showUserPath: (userId) => ctx.router.url('users.show', { userId }),
  ...args,
});

module.exports = {
  renderIndexPage: async (ctx) => {
    const conf = createConf(ctx, {
      posts: ctx.state.posts,
      page: +ctx.params.page || 1,
      createPostPath: ctx.router.url('posts.create'),
      randomPost: await getRandomPost(ctx),
      randomPosts: await getRandomPosts(ctx, 3),
      likedPosts: ctx.state.currentUser
        ? await checkUserLikedPosts(ctx.state.currentUser, ctx.state.posts)
        : null,
      postsLikeCount: await checkPostsLikeCount(ctx.state.posts),
      hasNextPage: ctx.state.hasNextPage,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      nextPagePath: (page) => ctx.router.url('posts.page', { page }),
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
    return ctx.render('index', conf);
  },
  renderAboutPage: async (ctx) => {
    const conf = createConf(ctx, {});
    return ctx.render('about', conf);
  },
  renderLoginPage: async (ctx) => {
    const conf = createConf(ctx, {
      userLoginPath: ctx.router.url('session.login'),
    });
    return ctx.render('session/login', conf);
  },
  renderSignupPage: async (ctx) => {
    const conf = createConf(ctx, {
      userSignupPath: ctx.router.url('session.signup'),
    });
    return ctx.render('session/signup', conf);
  },
  renderPostPage: async (ctx) => {
    const conf = createConf(ctx, {
      post: ctx.state.post,
      likedPost: ctx.state.currentUser
        ? await checkUserLikedPost(ctx.state.currentUser, ctx.state.post)
        : null,
      postLikeCount: await checkPostLikeCount(ctx.state.post),
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
    return ctx.render('posts/show', conf);
  },
  renderPostEditPage: async (ctx) => {
    const conf = createConf(ctx, {
      post: ctx.state.post,
      patchPostPath: (postId) => ctx.router.url('posts.patch', { postId }),
    });
    return ctx.render('posts/edit', conf);
  },
  renderUserPage: async (ctx) => {
    const conf = createConf(ctx, {
      user: ctx.state.user,
      showUserCreatedPostsPath: (userId) => ctx.router.url('users.show.posts', { userId }),
      showUserLikedPostsPath: (userId) => ctx.router.url('users.show.liked', { userId }),
      editUserPath: (userId) => ctx.router.url('users.edit', { userId }),
    });
    return ctx.render('users/index', conf);
  },
  renderUserEditPage: async (ctx) => {
    const conf = createConf(ctx, {
      user: ctx.state.user,
      patchUserPath: (userId) => ctx.router.url('users.edit', { userId }),
    });
    return ctx.render('users/edit', conf);
  },
  renderUserQueriedPostsPage: async (ctx) => {
    const spath = ctx.state.pageAction === 'liked' ? 'liked' : 'posts';
    const conf = createConf(ctx, {
      pageAction: ctx.state.pageAction,
      posts: ctx.state.posts,
      user: ctx.state.user,
      page: +ctx.params.page || 1,
      likedPosts: ctx.state.currentUser
        ? await checkUserLikedPosts(ctx.state.currentUser, ctx.state.posts)
        : null,
      postsLikeCount: await checkPostsLikeCount(ctx.state.posts),
      hasNextPage: ctx.state.hasNextPage,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      nextPagePath: (userId, page) => ctx.router.url(`users.show.${spath}.page`, { userId, page }),
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
    return ctx.render('users/queried_posts', conf);
  },
};
