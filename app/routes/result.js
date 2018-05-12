const Router = require('koa-router');

const controller = require('../controllers/result');
const router = new Router();

router.get('/', controller.list);
router.get('/:name', controller.get);
router.post('/', controller.add);

module.exports = router.routes();