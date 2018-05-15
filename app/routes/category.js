const Router = require('koa-router');

const controller = require('../controllers/category');
const router = new Router();

router
    .get('/',       controller.list)
    .post('/',      controller.add)
    .get('/:id',    controller.get)
    .put('/:id',    controller.update)
    // .delete('/:id', controller.delete);

module.exports = router.routes();