const Character = require('../models/character');
const db = require('../models/db');

module.exports = {
    getCharacters: async ctx => {
        await db.connect(ctx);
        ctx.body = await Character.find();
    }
}