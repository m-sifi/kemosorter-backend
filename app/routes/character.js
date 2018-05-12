const Router = require('koa-router');

const controller = require('../controllers/character');
const router = new Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.add);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router.routes();