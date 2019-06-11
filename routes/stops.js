const errors = require('restify-errors');
const Stop = require('../models/Stop');
const Utils = require('../utils');

module.exports = server => {

    const MAX_LONG = 999;
    const LONG_DEFAULT = 10;
    const BAD_REQUEST = 400;


    server.get('/stops', async (req, res, next) => { //TODO: agregar que devuelva solo los del usuario que los creo.

        try {
            const stops = await Stop.find({});
            res.send(stops);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/stops/:id', async (req, res, next) => {

        try {
            const stop = await Stop.findById(req.params.id);
            res.send(stop);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la parada con el id: ${req.params.id}`));
        }
    });

    server.post('/stops', async (req, res, next) => {
        let eta_stop = MAX_LONG;
        let long_stop = LONG_DEFAULT;
        let summary;

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const {num_stop, name, lat, long, status} = req.body;

        if (num_stop === undefined) {
            res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar un numero de parada"});
        }

        if (name === undefined) {
            res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar un nombre a la parada"});
        }

        if (lat === undefined) {
            res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar la latitud de laparada"});
        }

        if (long === undefined) {
            res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar la longitud de laparada"});
        }

        if (status === undefined) {
            res.send(BAD_REQUEST, {"code": "ValidationError", "mesage": "Se debe ingresar un estado a la parada"});
        }



        const prev_stop = await Stop.findOne({num_stop: (num_stop - 1)});
        if (prev_stop !== null) {
            try {
                summary = await Utils.rget([prev_stop.lat, prev_stop.long], [lat, long]);
                eta_stop = summary.travelTime;
            } catch (err) {
                // return next(new errors.InternalError("Error al consultar API externa. Intente nuevamente"));
            }
        }

        const stop = new Stop({
            num_stop,
            name,
            lat,
            long,
            eta_stop,
            long_stop,
            status
        });


        try {
            await stop.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError("No se pudo crear la alarma. Intente nuevamente."));
        }
    });

    server.put('/stops/:id', async (req, res, next) => {

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const stop = await Stop.findOneAndUpdate({_id: req.params.id}, req.body);
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la parada solicitada: ${req.params.id}`));
        }
    });

    server.del('/stops/:id', async (req, res, next) => {

        try {
            const stop = await Stop.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No existe la parada solicitada: ${req.params.id}`));
        }
    });

};