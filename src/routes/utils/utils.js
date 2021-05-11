const validateIntParam = async (param, ctx, next) => {
  const parsedParam = +param;
  if (parsedParam < 1 || !Number.isInteger(parsedParam)) {
    ctx.status = 404;
    return ctx.throw(404, 'Invalid parameter');
  }
  return next();
};

const requireLogin = async (ctx, next) => {
  if (!ctx.state.currentUser) {
    ctx.redirect(ctx.router.url('index.home'));
  }
  return next();
};

const excludeLogin = async (ctx, next) => {
  if (ctx.state.currentUser) {
    ctx.redirect(ctx.router.url('index.home'));
  }
  return next();
};

module.exports = {
  validateIntParam,
  requireLogin,
  excludeLogin,
};
