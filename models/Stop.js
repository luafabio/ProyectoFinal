const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const StopSchema = new mongoose.Schema({
    num_stop: {
        type: Number,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true,
        default: 0
    },
    long: {
        type: Number,
        required: true,
        default: 0
    },
    eta_stop: {
        type: Number,
        default:0
    },
    long_stop: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: 0
    }
});

StopSchema.plugin(timestamp);

const Stop = mongoose.model('Stop', StopSchema);
module.exports = Stop;