const Category = require("../models/category");
const mongoose = require("mongoose");

module.exports = {
    getCategories: async (ctx) => {
        await mongoose.connect(process.env.DATABASE_URL);
        ctx.body = await Category.find();
    }
}