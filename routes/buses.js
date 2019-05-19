const errors = require('restify-errors');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {
    server.get('/buses', async (req, res, next) => {
        const {imei, lat, long} = req.query;
        let bus;
        let nextStop;
        let distanceBusToStop;
        let here;

        bus = await Bus.findOne({imei: req.query.imei});

        if (bus) {
            bus.lat = req.query.lat;
            bus.long = req.query.long;
            bus.status = "on";

            //TODO: factibilidad de asincronismo
            nextStop = await Stop.findOne({id: req.query.next_stop});

            bus.attempts = 60; //TODO: sacar, solo para test

            here = await Utils.rget(nextStop, bus);
            bus.eta_next_stop = here.travelTime;

            if (bus.attempts === 60) { //TODO: llevar esto a constante
                here = await Utils.rget(nextStop, bus);
                bus.eta_next_stop = here.travelTime;
                bus.attempts = 0;
            }

            distanceBusToStop = distance(bus, nextStop);

            if (distanceBusToStop < nextStop.long_stop) {
                bus.status = 'on_change'; //TODO: llevar los estados a constantes

            } else if ((distance(bus, nextStop) >= nextStop.long_stop) && (nextStop.status === 'on_change')) {
                bus.next_stop++;
                bus.status = "on";
            }

            bus.save();

            res.send(200);
        } else {
            bus = new Bus({imei, lat, long, next_stop: 1, status: "initial"});
            try {
                const newBus = await bus.save();
                res.send(201);
            } catch (err) {
                return next(new errors.InternalError(err.message));
            }
        }

        next();
    });

    //TODO: llevar a Utils
    function distance(bus, stop) {
        return ((stop.lat - bus.lat) ^ 2 + (stop.long - bus.long) ^ 2) ^ (1 / 2)
    }
};