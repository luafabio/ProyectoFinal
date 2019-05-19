const errors = require('restify-errors');
const Bing = require('../models/Bing');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {
    server.get('/bing', async (req, res, next) => {
        try {
            const bings = await Bing.find({});
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
            return next(new errors.ResourceNotFoundError(`There is no alarm with the id of ${req.params.id}`));
        }
    });

    server.post('/bing', async (req, res, next) => {
        let bus_assign = 0;

        const {id_user, id_stop, time} = req.body;

        const bing = new Bing({
            id_user,
            id_stop,
            time,
            status: "created" //TODO llevar a constantes
        });

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        let buses = await Bus.find({},
            ['imei', 'next_stop', "status", "direction"],
            {
                sort: {
                    next_stop: 1
                }
            }
        );

        let stops = await Stop.find({},
            ['num_stop', 'name', "eta_stop", "status"],
            {
                sort: {
                    num_stop: 1
                }
            }
        );

        let stops_sum = 0;
        // bus.num_stop = 0;
        bing.bus_assign = 3;
        // for (let i = num_stop; i < this.stops.length; i++) {
        //     let bus = findObjectByKey(buses, "next_stop", i); //TODO: hacer funcion dedicada
        //     stops_sum += findObjectByKey(stops, "num_stop", i).eta_stop; //TODO: hacer funcion dedicada
        //
        //     if (bus !== null && bus.eta_next_stop + stops_sum > bing.time) {
        //         bing.bus_assign = bus.imei;
        //     }
        // }


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
            return next(new errors.ResourceNotFoundError(`There is no alarm with the id of ${req.params.id}`));
        }
    })

};

//TODO mover a Utils
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}