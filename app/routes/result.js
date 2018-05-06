const Router = require('koa-router');

const controller = require('../controllers/result');
const router = new Router();

router.get('/', controller.listResults);
router.get('/:name', controller.getResult);
router.post('/', controller.uploadResult);

module.exports = router.middleware();