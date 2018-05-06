const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');

const app = new Koa();

app.use(mount('/category', require('./routes/category')));
app.use(mount('/character', require('./routes/character')));
app.use(mount('/result', require('./routes/result')));
app.use(mount('/save', require('./routes/save')));

const router = new Router();
router.post('/', (ctx) => {
    ctx.body = ctx.request.body;
})

app.use(mount('/', router.routes()));

module.exports = app;