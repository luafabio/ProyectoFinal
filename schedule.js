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

        let stops = await Stop.find({status: {$ne: false}},
            ['num_stop', 'name', "eta_stop", "status"],
            {
                sort: {
                    num_stop: 1
                }
            }
        );

        for (let i = 0; i < this.stops.length; i++) {
            if (i === stops.length - 1) {
                position = await Utils.rget(stops[i], stops[0]);
            } else {
                position = await Utils.rget(stops[i], stops[i + 1]);
            }

            this.stops[i].eta_next_stop = position.travelTime;
            this.stops[i].save();
        }


        await Bing.find({}).exec().then(res => {
            this.bings = res
        });

        for (let i = 0; i < this.bings.length; i++) {
            this.bing = this.bings[i];
            let eta;
            await Bus.find({imei: this.bing.bus_assign}).exec().then(res => {
                this.bus = res[0]
            });
            if (this.bus === undefined && this.bus !== null) {
                continue;
            }

            eta = this.bus.eta_next_stop;

            for (let j = this.bus.next_stop; j <= this.bing.id_stop; j++) {
                let stop = await Utils.findObjectByKey(this.stops, "num_stop", j);
                if (stop !== undefined && stop !== null) {
                    eta += stop.eta_stop;
                }
            }
            if (eta <= this.bing.time * 60) {
                this.bing.status = "toDeliver"
            }

        }

        console.log("sincronizacion finalizada");
    }

}

module.exports = Schedule;