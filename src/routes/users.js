const KoaRouter = require('koa-router');
const { validateIntParam } = require('./utils/utils');
const { loadCurrentUser } = require('./utils/queries');
const { renderUserPage } = require('./utils/render');

const router = new KoaRouter();

router.param('userId', validateIntParam);
router.param('page', validateIntParam);

router.get('users.show', '/:userId', loadCurrentUser, renderUserPage);

router.get('users.show.posts', '/:userId/posts', loadCurrentUser, renderUserPage);

router.get('users.show.posts', '/:userId/posts/:page', loadCurrentUser, renderUserPage);

router.get('users.show.posts', '/:userId/liked', loadCurrentUser, renderUserPage);

router.get('users.show.liked', '/:userId/liked/:page', loadCurrentUser, renderUserPage);

module.exports = router;
