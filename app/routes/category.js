const Router = require("koa-router");

const controller = require("../controllers/category");
const router = new Router();

router.get("/", controller.getCategories);

module.exports = router.middleware();