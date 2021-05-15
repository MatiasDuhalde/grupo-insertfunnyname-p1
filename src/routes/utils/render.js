const {
  checkUserLikedPost,
  checkUserLikedPosts,
  checkPostLikeCount,
  checkPostsLikeCount,
  getRandomPost,
  getRandomPosts,
} = require('./queries');

module.exports = {
  renderIndexPage: async (ctx) => {
    const likedPosts = ctx.state.currentUser
      ? await checkUserLikedPosts(ctx.state.currentUser, ctx.state.posts)
      : null;
    await ctx.render('index', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      posts: ctx.state.posts,
      page: +ctx.params.page || 1,
      createPostPath: ctx.router.url('posts.create'),
      randomPost: await getRandomPost(ctx),
      randomPosts: await getRandomPosts(ctx, 3),
      likedPosts,
      postsLikeCount: await checkPostsLikeCount(ctx.state.posts),
      hasNextPage: ctx.state.hasNextPage,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      nextPagePath: (page) => ctx.router.url('posts.page', { page }),
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
  },
  renderLoginPage: async (ctx) => {
    await ctx.render('session/login', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      userLoginPath: ctx.router.url('session.login'),
    });
  },
  renderSignupPage: async (ctx) => {
    await ctx.render('session/signup', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      userSignupPath: ctx.router.url('session.signup'),
    });
  },
  renderPostPage: async (ctx) => {
    const likedPost = ctx.state.currentUser
      ? await checkUserLikedPost(ctx.state.currentUser, ctx.state.post)
      : null;
    await ctx.render('posts/show', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      post: ctx.state.post,
      likedPost,
      postLikeCount: await checkPostLikeCount(ctx.state.post),
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
  },
  renderPostEditPage: async (ctx) => {
    await ctx.render('posts/edit', {
      post: ctx.state.post,
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      patchPostPath: (postId) => ctx.router.url('posts.patch', { postId }),
    });
  },
  renderUserPage: async (ctx) => {
    await ctx.render('users/index', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      user: ctx.state.user,
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      showUserCreatedPostsPath: (userId) => ctx.router.url('users.show.posts', { userId }),
      showUserLikedPostsPath: (userId) => ctx.router.url('users.show.liked', { userId }),
    });
  },
  renderUserQueriedPostsPage: async (ctx) => {
    const { pageAction } = ctx.state;
    const subpath = pageAction === 'liked' ? 'liked' : 'posts';
    const likedPosts = ctx.state.currentUser
      ? await checkUserLikedPosts(ctx.state.currentUser, ctx.state.posts)
      : null;
    await ctx.render('users/queried_posts', {
      userIsLoggedIn: Boolean(ctx.state.currentUser),
      currentUser: ctx.state.currentUser,
      loginPath: ctx.router.url('session.login'),
      signupPath: ctx.router.url('session.signup'),
      logoutPath: ctx.router.url('session.logout'),
      pageAction,
      posts: ctx.state.posts,
      user: ctx.state.user,
      page: +ctx.params.page || 1,
      likedPosts,
      postsLikeCount: await checkPostsLikeCount(ctx.state.posts),
      hasNextPage: ctx.state.hasNextPage,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      nextPagePath: (userId, page) => {
        const path = `users.show.${subpath}.page`;
        return ctx.router.url(path, {
          userId,
          page,
        });
      },
      likePostPath: (postId) => ctx.router.url('posts.like', { postId }),
      unlikePostPath: (postId) => ctx.router.url('posts.unlike', { postId }),
    });
  },
};
