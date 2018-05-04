const Character = require("../models/character");
const Result = require("../models/result");
const mongoose = require("mongoose");
const fs = require("../utils/async-fs");
const str = require("../utils/string");
const _ = require("underscore");

var self = module.exports = {
    generateResultName: async (results, top_results) => {
        let tmp_results = _.map(results, (x) => { return mongoose.Types.ObjectId(x); });
        let where = { $match: { _id: { $in: tmp_results }}}
        let projection = { $addFields: { "__id": { $indexOfArray: [ tmp_results, "$_id"] }} };
        let sort = { $sort: { "__id": 1 } };

        let characters = await Character.aggregate([ where, projection, sort ]);
        let adjectives = (await fs.readFile("app/assets/adjectives.txt")).split("\n");

        if(top_results) {
            return str.capitalise(_.sample(adjectives)) + str.capitalise(_.sample(adjectives)) +  _.sample(_.first(characters, 10)).name.replace(/[^a-zA-Z]+/g, "");
        } else {
            return str.capitalise(_.sample(adjectives)) + str.capitalise(_.sample(adjectives)) +  _.sample(characters).name.replace(/[^a-zA-Z]+/g, "");
        }
    },

    listResults: async (ctx) => {
        await mongoose.connect(process.env.DATABASE_URL);
        ctx.body = await Result.find().select("name");
    },

    getResult: async (ctx) => {
        let name = ctx.params.name;

        if(name) {
            await mongoose.connect(process.env.DATABASE_URL);
            ctx.body = await Result.findOne({ name: name }).populate("ranking.character");
        } else {
            ctx.throw(400, "Parameter 'Name' is required");
        }
    },
    
    uploadResult: async (ctx) => {
        let result = JSON.parse(ctx.request.body.result);
        
        if(result) {
            // result.ranking = JSON.parse(result.ranking);
            
            let characters = _.map(result.ranking, x => { return x.character });

            await mongoose.connect(process.env.DATABASE_URL);
            result.name = await self.generateResultName(characters, true);
            ctx.body = await Result.create(result);
        } else {
            ctx.throw(400, "Sorter results is required");
        }
    }
}