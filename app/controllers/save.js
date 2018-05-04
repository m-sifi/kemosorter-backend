const Save = require("../models/save");
const mongoose = require("mongoose");
const _ = require("underscore");

module.exports = {
    // getCategories: async (ctx) => {
    //     await mongoose.connect(process.env.DATABASE_URL);
    //     ctx.body = await Save.find();
    // },

    uploadSave: async (ctx) => {
        let controller = require("./result");
        let save = ctx.request.body.save;

        console.log(save);

        if(save) {
            let characters = save.characters; //save.characterData.match(/.{1,24}/g);
            // console.log(characters);

            await mongoose.connect(process.env.DATABASE_URL);
            save.name = await controller.generateResultName(characters);
            ctx.body = await Save.create(save);
        } else {
            ctx.throw(400, "Sorter save data required");
        }
    },

    getSave: async (ctx) => {
        let controller = require("./result");
        let name = ctx.params.name;

        if(name) {
            await mongoose.connect(process.env.DATABASE_URL);
            ctx.body = await Save.findOne({ name: name })
                .populate('characters')
                .populate('categories');
        } else {
            ctx.throw(400, "Sorter save data name required");
        }
    }
}