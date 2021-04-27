const validateIntParam = async (param, ctx, next) => {
  const parsedParam = +param;
  if (parsedParam < 1 || !Number.isInteger(parsedParam)) {
    ctx.status = 404;
    return ctx.throw(404, 'Invalid parameter');
  }
  return next();
};

module.exports = {
  validateIntParam,
};
