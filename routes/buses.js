const errors = require('restify-errors');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {
    server.get('/buses', async (req, res, next) => {
        a = await Utils.rget();
        res.send(a);
        next();
    });
};