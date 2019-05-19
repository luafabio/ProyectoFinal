'use strict';

const Bus = require('./models/Bus');
const Stop = require('./models/Stop');
const Bing = require('./models/Bing');

const Utils = require('./utils');


class Schedule {

    constructor() {

    }

    async getStops() {
        console.log("Run Worker");

        let position;

        await Stop.find({}).exec().then(res => {
            this.stops = res
        });
        //
        // for (let i = 0; i < this.stops.length; i++) {
        //     if (i === this.stops.length - 1) {
        //         position = await Utils.rget(this.stops[i], this.stops[0]);
        //     } else {
        //         position = await Utils.rget(this.stops[i], this.stops[i + 1]);
        //     }
        //
        //     this.stops[i].eta_next_stop = position.travelTime;
        //     this.stops[i].save();
        // }



        await Bing.find({}).exec().then(res => {
            this.bings = res
        });

        for (let i = 0; i < this.bings.length; i++) {
            this.bing = this.bings[i];
            let eta;
            await Bus.find({imei: this.bing.bus_assign}).exec().then(res => {
                this.bus = res[0]
            });

            eta = this.bus.eta_next_stop;

            for (let j = this.bus.next_stop; j <= this.bing.id_stop; j++) {
                let stop = await Utils.findObjectByKey(this.stops, "num_stop", j);
                if (stop !== undefined) {
                    eta += stop.eta_stop;
                }
            }
            if (eta <= this.bing.time) {
                this.bing.status = "toDeliver"
            }

        }


        console.log("sincronizacion finalizada");
    }

}

module.exports = Schedule;