const env = require("../utils/env");

const Category = require('../models/category');
const Character = require('../models/character');
const db = require('../models/db');
const validator = require('validator');
const _ = require('underscore');

module.exports = {
    list: async ctx => {
        await db.connect(ctx);
        ctx.body = await Category.find();
    },

    get: async ctx => {
        let id = ctx.params.id;
        let category = null;

        if(!validator.isMongoId(id)) {
            ctx.throw(400, 'Category ID must be a valid ID');
        } else {
            await db.connect(ctx);
            category = await Category.findOne({ _id: id });

            if(category) {
                ctx.body = category;
            } else {
                ctx.throw(400, 'Unable to find Category');
            }
        }
    },

    add: async ctx => {
        let token = ctx.request.query.token;
        let body = ctx.request.body;
        let category = new Category(body);
        let error = category.validateSync();

        if(token != env.vars.kemosorter.secret) {
            ctx.throw(403, 'Invalid Access-Token');
        } else {
            await db.connect(ctx);

            if(error) {
                ctx.throw(400, error.message);
            } else if (await Category.findOne({ name: body.name })) {
                ctx.throw(400, 'Category already exists');
            } else {
                ctx.body = await Category.create(category);
            }
        }
    },

    update: async ctx => {
        let token = ctx.request.query.token;
        let id = ctx.params.id;
        let body = ctx.request.body;

        if(token != env.vars.kemosorter.secret) {
            ctx.throw(403, 'Invalid Access-Token');
        } else {
            await db.connect(ctx);
            ctx.body = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true});
        }
    },

    delete: async ctx => {
        let id = ctx.params.id;

        if(!validator.isMongoId(id)) {
            ctx.throw(400, 'Category ID must be a valid ID');
        } else {
            await db.connect(ctx);

            // Check if there's any Characters associated with the Category to-be-deleted
            let count = await Character.find({ categories: id }).count();

            if(count > 0) {
                ctx.throw(400, `Unable to delete Category (There are ${count} friends associated under this Category)`);
            } else {
                await Category.findByIdAndRemove(id);
                ctx.body = true;
            }
        }
    }
}