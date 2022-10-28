const Character = require('../models/character');
const Result = require('../models/result');
const mongoose = require("mongoose");
const db = require('../models/db');
const fs = require('../utils/async-fs');
const str = require('../utils/string');
const _ = require('underscore');

const fetch = require('node-fetch');

var self = module.exports = {
    generateResultName: async (results, top_results) => {
        let tmp_results = _.map(results, (x) => { return mongoose.Types.ObjectId(x); });
        let where = { $match: { _id: { $in: tmp_results }}}
        let projection = { $addFields: { '__id': { $indexOfArray: [ tmp_results, '$_id'] }} };
        let sort = { $sort: { '__id': 1 } };

        let characters = await Character.aggregate([ where, projection, sort ]);
        // let adjectives = (await fs.readFile('../assets/adjectives.txt')).split('\n');
        let response = await fetch("https://raw.githubusercontent.com/m-sifi/kemosorter-backend/master/app/assets/adjectives.txt")
        let adjectivesStream = await response.text();
        let adjectives = adjectivesStream.split('\n');

        if(top_results) {
            return str.capitalise(_.sample(adjectives)) + str.capitalise(_.sample(adjectives)) +  _.sample(_.first(characters, 10)).name.replace(/[^a-zA-Z]+/g, '');
        } else {
            return str.capitalise(_.sample(adjectives)) + str.capitalise(_.sample(adjectives)) +  _.sample(characters).name.replace(/[^a-zA-Z]+/g, '');
        }
    },

    list: async ctx => {
        await db.connect(ctx);
        ctx.body = await Result.find().select('name');
    },

    get: async ctx => {
        let name = ctx.params.name;

        if(name) {
            await db.connect(ctx);
            ctx.body = await Result.findOne({ name: name }).populate('ranking.character');
        } else {
            ctx.throw(400, '"Name" is required');
        }
    },
    
    add: async ctx => {
        let result = JSON.parse(ctx.request.body.result);
        
        if(result) {
            let characters = _.map(result.ranking, x => { return x.character });

            await db.connect(ctx);
            result.name = await self.generateResultName(characters, true);
            ctx.body = await Result.create(result);
        } else {
            ctx.throw(400, 'Results is required/invalid');
        }
    }
}