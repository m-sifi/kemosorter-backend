const Router = require('koa-router');

const controller = require('../controllers/result');
const router = new Router();

router
    .get('/',       controller.list)
    .post('/',      controller.add)
    .get('/:name',  controller.get)

module.exports = router.routes();