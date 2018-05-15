const Router = require('koa-router');

const controller = require('../controllers/save');
const router = new Router();

router
    .post('/',      controller.add)
    .get('/:name',  controller.get)

module.exports = router.routes();