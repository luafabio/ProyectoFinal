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
        required: false,
        trim: true
    }, 
    next_stop: {
        type: Number,
        default: 1,
        required: false,
    },
    eta_next_stop: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    attempts: {
        type: Number,
        default: 0,
        required: false,
    },

});

BusSchema.plugin(timestamp);

const Bus = mongoose.model('Bus', BusSchema);
module.exports = Bus;