'use strict';

const Bus = require('./models/Bus');
const Stop = require('./models/Stop');
const Bing = require('./models/Bing');

const Utils = require('./utils');

const STATUS_ACTIVE ='Activa';
const STATUS_FINISH = 'Finalizada';

class Schedule {

    constructor() {
    }

    async getStops() {
        console.log("Run Worker");

        let position;

        let stops = await Stop.find({status: {$ne: false}}, //TODO: Buscar en todos lados paradas no activas
            ['num_stop', 'name', "eta_stop", "status"],
            {
                sort: {
                    num_stop: 1
                }
            }
        );

        // for (let i = 0; i < this.stops.length; i++) {
        //     if (i === stops.length - 1) {
        //         position = await Utils.rget(stops[i], stops[0]);
        //     } else {
        //         position = await Utils.rget(stops[i], stops[i + 1]);
        //     }
        //
        //     this.stops[i].eta_next_stop = position.travelTime;
        //     this.stops[i].save();
        // }


        await Bing.find({}).exec().then(res => { // TODO: buscar alarmas no finalizadas
            this.bings = res
        });
        for (let i = 0; i < this.bings.length; i++) {
            this.bing = this.bings[i];
            this.bing.status = STATUS_ACTIVE;
            let eta;
            await Bus.find({imei: this.bing.bus_assign}).exec().then(res => {
                this.bus = res[0]
            });

            if (this.bus === undefined && this.bus !== null) {
                continue;
            }

            eta = this.bus.eta_next_stop;
            for (let j = this.bus.next_stop; j <= this.bing.id_stop; j++) {
                let stop = await Utils.findObjectByKey(stops, "num_stop", j);
                if (stop !== undefined && stop !== null) {
                    eta += stop.eta_stop;
                }
            }
            if (eta <= this.bing.time * 60 && this.bing.status!== STATUS_FINISH) {
                this.bing.status = STATUS_FINISH;
                Utils.sendPush(this.bing.id_user)
            }

            this.bing.save();

        }

        console.log("sincronizacion finalizada");
    }
}

module.exports = Schedule;