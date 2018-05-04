const Router = require("koa-router");

const controller = require("../controllers/save");
const router = new Router();

router.get("/:name", controller.getSave);
router.post("/", controller.uploadSave);

module.exports = router.routes();