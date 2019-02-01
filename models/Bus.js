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
});

BusSchema.plugin(timestamp);

const Bus = mongoose.model('Bus', BusSchema);
module.exports = Bus;