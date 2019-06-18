const errors = require('restify-errors');
const Bing = require('../models/Bing');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {

    const STATUS_INITIAL = 'Creada';
    const BAD_REQUEST = 400;


    server.get('/bing', async (req, res, next) => {
        try {
            const {id_user} = req.query;
            if (id_user === undefined) {
                res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar un id de usuario"});
            }

            let bings = await Bing.find({id_user: id_user},{},
                {
                    sort: {
                        createdAt: -1
                    }
                }
            );

            res.send(bings);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/bing/:id', async (req, res, next) => {

        try {
            const bing = await Stop.findById(req.params.id);
            res.send(bing);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la alarma con el id: ${req.params.id}`));
        }
    });

    server.post('/bing', async (req, res, next) => {
        console.log('request');
        let stops_sum = 0;

        let {id_user, id_stop, time} = req.body;
        const bing = new Bing({
            id_user,
            id_stop,
            time,
            status: STATUS_INITIAL
        });

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        let buses = await Bus.find({},
            ['imei', 'next_stop', "eta_next_stop", "status", "direction"],
            {
                sort: {
                    next_stop: 1
                }
            }
        );

        let stops = await Stop.find({status: {$ne: false}},
            ['num_stop', 'name', "eta_stop", "status"],
            {
                sort: {
                    num_stop: 1
                }
            }
        );

        let i = 0;
        let j = bing.id_stop;
        console.log(stops.length);
        while (i < stops.length) {
            let bus = await Utils.findObjectByKey(buses, "next_stop", j);
            let stop = await Utils.findObjectByKey(stops, "num_stop", j);

            if (stop !== null) {
                stops_sum += stop.eta_stop;
            }
            if (bus !== null && bus.eta_next_stop + stops_sum > bing.time * 60) {
                bing.bus_assign = bus.imei;
                break;
            }
            j--;
            i++;
        }
        let search = await Utils.findObjectByKey(stops, "num_stop", bing.id_stop);
        bing.name_stop = search.name;

        try {
            await bing.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

    server.del('/bing/:id', async (req, res, next) => {

        try {
            const bing = await Bing.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la alarma con el id: ${req.params.id}`));
        }
    })

};
