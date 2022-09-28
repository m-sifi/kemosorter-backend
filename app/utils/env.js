const dotenv = require("dotenv");
const secrets = require('./secrets');

const environments = {};

dotenv.config();

environments.vars = {
    port: process.env.PORT,

    kemosorter: {
        secret: secrets.read("SECRET") || process.env.SECRET
    },

    database: {
        url: secrets.read("DATABASE_URL") || process.env.DATABASE_URL
    }
};

module.exports = environments;