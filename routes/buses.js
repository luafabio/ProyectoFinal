const errors = require('restify-errors');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {

    const STATUS_ON = 'Activo';
    const STATUS_ON_CHANGE = 'Cambio';
    const MAX_ATTEMPS = '3';

    server.get('/buses', async (req, res, next) => {
        const {imei, lat, long} = req.query;
        let bus;
        let nextStop;
        let distanceBusToStop = 0.0;

        bus = await Bus.findOne({imei: req.query.imei});

        if (bus) {
            bus.lat = req.query.lat;
            bus.long = req.query.long;

            nextStop = await Stop.findOne({num_stop: bus.next_stop});

            distanceBusToStop = await Utils.distance(bus, nextStop);

            if (distanceBusToStop < nextStop.long_stop) {
                bus.status = STATUS_ON_CHANGE;
            }

            if (bus.status === STATUS_ON_CHANGE && distanceBusToStop >= nextStop.long_stop) {
                bus.next_stop++;
                bus.status = STATUS_ON;
                bus.eta_next_stop = await Utils.calculateDistance(bus, nextStop);
            }

            await bus.save();
            res.send(200);

        } else {
            if (req.query.next_stop === undefined) {
                nextStop = 1;
            } else {
                nextStop = req.query.next_stop;
            }

            const stop = await Stop.findOne({ num_stop: nextStop});
            bus = new Bus({imei, lat, long, status: STATUS_ON, next_stop: nextStop});
            bus.eta_next_stop = await Utils.calculateDistance(bus, stop);

            try {
                await bus.save();
                res.send(201);
            } catch (err) {
                return next(new errors.InternalError(err.message));
            }
        }

        next();
    });

    server.get('/list-buses', async (req, res, next) => {
        try {
            const bus = await Bus.find({});
            res.send(bus);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/list-buses/:id', async (req, res, next) => {
        try {
            const bus = await Bus.findById(req.params.id);
            res.send(bus);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe el colectivo con el id: ${req.params.id}`));
        }
    });

    server.del('/bus/:id', async (req, res, next) => {

        try {
            const bus = await Bus.findOneAndDelete({imei: req.params.id});
            bus.save();
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la alarma con el id: ${req.params.id}`));
        }
    })
};