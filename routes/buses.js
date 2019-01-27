const errors = require('restify-errors');
const Stop = require('../models/Stop');

module.exports = server => {
    server.get('/buses', async (req, res, next) => {

        try {
            // console.log(req, res);
            res.send('estoy en internet');
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });
};