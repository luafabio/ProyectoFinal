const errors = require('restify-errors');
const Bus = require('../models/Bus');
const Utils = require('../utils');

module.exports = server => {
    server.get('/buses', async (req, res, next) => {
        console.log(req.query);
        const { imei, lat, long } = req.body;
        
        const bus = new Bus({
            imei,
            lat,
            long
        });
        
        console.log(bus);
        // a = await Utils.rget();
        // res.send(a);
        // next();

        ;
    });
};