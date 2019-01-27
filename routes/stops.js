const errors = require('restify-errors');
const Stop = require('../models/Stop');

module.exports = server => {
    server.get('/stops', async (req, res, next) => {

        try {
            const stops = await Stop.find({});
            res.send(stops);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/stops/:id', async (req, res, next) => {

        try {
            const stop = await Stop.findById(req.params.id);
            res.send(stop);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    });

    server.post('/stops', async (req, res, next) => {
        
        if (!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const { name, lat, long, eta_stop, long_stop, status } = req.body;

        const stop = new Stop({
            name,
            lat,
            long,
            eta_stop,
            long_stop,
            status
        });

        try {
            const newStop = await stop.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });

    server.put('/stops/:id', async (req, res, next) => {
        
        if (!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const stop = await Stop.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    });

    server.del('/stops/:id', async (req, res, next) => {
        
        try {
            const stop = await Stop.findOneAndRemove({ _id: req.params.id });
            res.send(204);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    })
    
};