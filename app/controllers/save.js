const Save = require('../models/save');
const db = require('../models/db');
const _ = require('underscore');

module.exports = {
    uploadSave: async ctx => {
        let controller = require('./result');
        let save = JSON.parse(ctx.request.body.save);

        console.log(save);

        if(save) {
            let characters = save.characters;

            await db.connect(ctx);
            save.name = await controller.generateResultName(characters);
            ctx.body = await Save.create(save);
        } else {
            ctx.throw(400, 'Sorter save data required');
        }
    },

    getSave: async ctx => {
        let controller = require('./result');
        let name = ctx.params.name;

        if(name) {
            await db.connect(ctx);
            ctx.body = await Save.findOne({ name: name })
                .populate('characters')
                .populate('categories');
        } else {
            ctx.throw(400, 'Sorter save data name required');
        }
    }
}