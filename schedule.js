'use strict';
const Stop = require('./models/Stop');
const Utils = require('./utils');


class Schedule {

    constructor() {

    }

    async getStops() {
        let position;

        await Stop.find({}).exec().then(res => {
            this.stops = res
        });


        for (let i = 0; i < this.stops.length; i++) {
            if (i === this.stops.length - 1) {
                position = await Utils.rget(this.stops[i], this.stops[0]);
            } else {
                position = await Utils.rget(this.stops[i], this.stops[i + 1]);
            }

            this.stops[i].eta_next_stop = position.travelTime;
            this.stops[i].save();
        }
        console.log("sincronizacion finalizada");
        process.exit() //TODO: agregar intervalo
    }

}

module.exports = Schedule;