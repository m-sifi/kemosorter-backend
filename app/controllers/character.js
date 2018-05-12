const Character = require('../models/character');
const Save = require('../models/save');
const Result = require('../models/result');
const db = require('../models/db');
const validator = require('validator');
const _ = require('underscore');

module.exports = {
    list: async ctx => {
        await db.connect(ctx);
        ctx.body = await Character.find().populate('categories');
    },

    get: async ctx => {
        let id = ctx.params.id;
        let character = null;

        if(!validator.isMongoId(id)) {
            ctx.throw(400, 'Character ID must be a valid ID');
        } else {
            await db.connect(ctx);
            character = await Character.findOne({ _id: id });

            if(character) {
                ctx.body = character;
            } else {
                ctx.throw(400, 'Unable to find Character');
            }
        }
    },

    add: async ctx => {
        let body = ctx.request.body;
        let character = new Character(body);
        let error = character.validateSync();

        await db.connect(ctx);

        if(error) {
            ctx.throw(400, error.message);
        } else if (await Character.findOne({ name: body.name })) {
            ctx.throw(400, 'Character already exists');
        } else {
            ctx.body = await Character.create(character);
        }
    },
    
    update: async ctx => {
        let id = ctx.params.id;
        let body = ctx.request.body;
        let error = (new Character(body)).validateSync();

        await db.connect(ctx);

        if(!validator.isMongoId(id)) {
            ctx.throw(400, 'Category ID must be a valid ID');
        } if(error) {
            ctx.throw(400, error.message);
        } else if (await Character.findOne({_id: id }) == null) {
            ctx.throw(400, 'Unable to find Character');
        } else {
            ctx.body = await Character.findByIdAndUpdate(id, body);
        }
    },

    delete: async ctx => {
        let id = ctx.params.id;

        if(!validator.isMongoId(id)) {
            ctx.throw(400, 'Character ID must be a valid ID');
        } else {
            await db.connect(ctx);

            // Check if there's any Results/Saves associated with the Character to-be-deleted
            let count = (await Save.find({ characters: id }).count()) + ((await Result.find({ ranking: { $elemMatch: { character: id }}}).count()));

            if(count > 0) {
                ctx.throw(400, `Unable to delete Character (There are ${count} saves/results associated under this Character)`);
            } else {
                await Character.findByIdAndRemove(id);
                ctx.body = true;
            }
        }
    }
}