const Router = require('koa-router');

const controller = require('../controllers/save');
const router = new Router();

router.get('/:name', controller.get);
router.post('/', controller.add);

module.exports = router.routes();