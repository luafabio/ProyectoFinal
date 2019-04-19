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