const Category = require('../models/category');
const db = require('../models/db');

module.exports = {
    getCategories: async ctx => {
        await db.connect(ctx);
        ctx.body = await Category.find();
    },
    
    // addCategory: async ctx => {
    //     let name = ctx.request.body.name;
        
    //     if(name) {
    //         await db.connect(ctx);
    //         ctx.body = await Category.create({ name: name });
    //     } else {
    //         ctx.throw("'Name' is required");
    //     }
    // }
}