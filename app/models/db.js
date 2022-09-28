
const env = require("../utils/env");
const mongoose = require('mongoose');

module.exports = {
    connect: async ctx => {
        try {
            await mongoose.connect(env.vars.database.url);
            console.log('Successfully connected to database');
        } catch (err) {
            ctx.throw(400, 'Unable to connect to remote database');
        }
    }
}