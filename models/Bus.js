const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

BusSchema.plugin(timestamp);

const Stop = mongoose.model('Bus', BusSchema);
module.exports = Bus;