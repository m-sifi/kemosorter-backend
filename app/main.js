require('dotenv').config() // Load .env if it has not been loaded before

const Koa = require("koa");
const mount = require("koa-mount");

const PORT = process.env.PORT || 5000;
let app = new Koa();

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('@koa/cors')());

app.use(mount("/api", require("./api")));

app.listen(PORT);
console.log("[KemofureSorter API] Listening at port " + PORT);
