const { getPostsUsers, getPostUser, getSingleUser } = require('./queries');

module.exports = {
  renderIndexPage: async (ctx) => {
    const users = await getPostsUsers(ctx, ctx.state.posts);
    return ctx.render('index', {
      currentUser: ctx.state.currentUser,
      posts: ctx.state.posts,
      users,
      page: +ctx.params.page || 1,
      createPostPath: ctx.router.url('posts.create'),
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
      nextPagePath: (page) => ctx.router.url('posts.page', { page }),
    });
  },
  renderPostPage: async (ctx) => {
    const user = await getPostUser(ctx, ctx.state.post);
    return ctx.render('posts/show', {
      currentUser: ctx.state.currentUser,
      post: ctx.state.post,
      user,
      deletePostPath: (postId) => ctx.router.url('posts.delete', { postId }),
      showPostPath: (postId) => ctx.router.url('posts.show', { postId }),
      editPostPath: (postId) => ctx.router.url('posts.edit', { postId }),
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
    });
  },
  renderPostEditPage: async (ctx) => {
    await ctx.render('posts/edit', {
      post: ctx.state.post,
      patchPostPath: (postId) => ctx.router.url('posts.patch', { postId }),
    });
  },
  renderUserPage: async (ctx) => {
    const user = await getSingleUser(ctx, +ctx.params.userId);
    await ctx.render('users/index', {
      currentUser: ctx.state.currentUser,
      user,
      showUserPath: (userId) => ctx.router.url('users.show', { userId }),
    });
  },
};
