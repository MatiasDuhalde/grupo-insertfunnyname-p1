module.exports = {
  renderIndexPage: async (ctx) => {
    await ctx.render('index', {
      currentUser: ctx.state.currentUser,
      posts: ctx.state.posts,
      page: +ctx.params.page || 1,
      createPostPath: ctx.router.url('posts.create'),
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      nextPagePath: (page) => ctx.router.url('posts.page', { page }),
      likePostPath: (page) => ctx.router.url('posts.like', { page }),
      unlikePostPath: (page) => ctx.router.url('posts.unlike', { page }),
    });
  },
  renderPostPage: async (ctx) => {
    await ctx.render('posts/show', {
      currentUser: ctx.state.currentUser,
      post: ctx.state.post,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      likePostPath: (page) => ctx.router.url('posts.like', { page }),
      unlikePostPath: (page) => ctx.router.url('posts.unlike', { page }),
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
      currentUser: ctx.state.currentUser,
      user: ctx.state.user,
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      showUserCreatedPostsPath: (userId) => ctx.router.url('users.show.posts', { userId }),
      showUserLikedPostsPath: (userId) => ctx.router.url('users.show.liked', { userId }),
    });
  },
  renderUserQueriedPostsPage: async (ctx) => {
    const { pageAction } = ctx.state;
    const subpath = pageAction === 'liked' ? 'liked' : 'posts';
    await ctx.render('users/queried_posts', {
      currentUser: ctx.state.currentUser,
      pageAction,
      posts: ctx.state.posts,
      user: ctx.state.user,
      page: +ctx.params.page || 1,
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
      likePostPath: (page) => ctx.router.url('posts.like', { page }),
      unlikePostPath: (page) => ctx.router.url('posts.unlike', { page }),
    });
  },
};
