const Router = require("koa-router");

const controller = require("../controllers/character");
const router = new Router();

router.get("/", controller.getCharacters);

module.exports = router.middleware();