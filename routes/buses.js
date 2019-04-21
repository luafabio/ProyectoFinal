const errors = require('restify-errors');
const Bus = require('../models/Bus');
const Utils = require('../utils');

module.exports = server => {
    server.get('/buses', async (req, res, next) => {
        const { imei, lat, long } = req.query;
        const bus = new Bus({
            imei,
            lat,
            long
        });
        
        a = await Utils.rget();
        res.send();
        next();
    });
};