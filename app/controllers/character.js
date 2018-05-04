const Character = require("../models/character");
const mongoose = require("mongoose");

module.exports = {
    getCharacters: async (ctx) => {
        await mongoose.connect(process.env.DATABASE_URL);
        ctx.body = await Character.find();
    }
}