const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BingSchema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true,
    },
    id_stop: {
        type: Number,
        required: true,
    },
    name_stop: {
        type: String,
    },
    time: {
        type: Number,
        required: true,
    },
    bus_assign: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

BingSchema.plugin(timestamp);

const Bing = mongoose.model('Bing', BingSchema);
module.exports = Bing;