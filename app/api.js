const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');
const db = require('./models/db');

const app = new Koa();

app.use(mount('/category',  require('./routes/category')));
app.use(mount('/character', require('./routes/character')));
app.use(mount('/result',    require('./routes/result')));
app.use(mount('/save',      require('./routes/save')));

module.exports = app;