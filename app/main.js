const env = require("./utils/env")// Load .env if it has not been loaded before

const Koa = require('koa');
const mount = require('koa-mount');

const PORT = env.vars.port || 5000;
let app = new Koa();

const test = require("./controllers/result")

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('@koa/cors')());

app.use(mount('/api', require('./api')));

app.listen(PORT);
console.log('[KemofureSorter API] Listening at port ' + PORT);