const Router = require('koa-router');

const controller = require('../controllers/category');
const router = new Router();

router
    .get('/',       controller.list)
    .get('/:id',    controller.get)
    .post('/',      controller.add)
    .put('/:id',    controller.update)
    .delete('/:id', controller.delete);

module.exports = router.routes();