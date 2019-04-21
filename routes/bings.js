const errors = require('restify-errors');
const Bing = require('../models/Bing');
const Utils = require('../utils');

module.exports = server => {
    server.get('/bing', async (req, res, next) => {
        try {
            const bings = await Bing.find({});
            res.send(bings);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    server.get('/bing/:id', async (req, res, next) => {

        try {
            const bing = await Stop.findById(req.params.id);
            res.send(bing);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no alarm with the id of ${req.params.id}`));
        }
    });

    server.post('/bing', async (req, res, next) => {
        let status = "New"
        let bus_assign = 0

        if (!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const { id_user, id_stop, time} = req.body;
        const bing = new Bing({
            id_user,
            id_stop,
            time,
            bus_assign,
            status
        });

        try {
            const newBing = await bing.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });

    server.del('/bing/:id', async (req, res, next) => {
        
        try {
            const bing = await Bing.findOneAndRemove({ _id: req.params.id });
            res.send(204);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no alarm with the id of ${req.params.id}`));
        }
    })
    
};