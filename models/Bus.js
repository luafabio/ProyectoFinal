const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BusSchema = new mongoose.Schema({
    imei: {
        type: Number,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true,
        trim: true
    },
    long: {
        type: Number,
        required: true,
        trim: true
    }, 
    next_stop: {
        type: Number,
        default: 1,
        required: true,
    },
    eta_next_stop: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 60,
        required: true,
    },

});

BusSchema.plugin(timestamp);

const Bus = mongoose.model('Bus', BusSchema);
module.exports = Bus;