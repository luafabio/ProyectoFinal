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
        // console.log("Run Worker");
        let bings = [];
        let bing;
        let stops = [];
        let bus = {};
        let position;

        stops = await Stop.find({status: {$ne: false}},
            ['lat', 'long', 'num_stop', 'name', "eta_stop", "status"],
            {
                sort: {
                    num_stop: 1
                }
            }
        );
        //Calcula el tiempo a la siguiente parada. Ej: parada 16: eta = xx tiempo para llegar a parada 17
        // if (stops.length > 0) {
        //     for (let i = 0; i < stops.length; i++) {
        //         try{
        //             if (i === stops.length - 1) {
        //                 position = await Utils.rget(stops[i], stops[0]);
        //             } else {
        //                 position = await Utils.rget(stops[i], stops[i + 1]);
        //             }
        //         } catch (e) {
        //         }
        //         if (position !== undefined && position !== null) {
        //             stops[i].eta_next_stop = position.travelTime;
        //             stops[i].save();
        //         }
        //     }
        // } else {
        //     console.log("cannot get stops");
        // }



        await Bing.find({'status': {$ne: STATUS_FINISH}}).exec().then(res => {
            bings = res
        });

        // for (let i = 0; i < bings.length; i++) {
        //     let bingBus = bing.bus_assign;
        //     let here = await Utils.rget(stops.bus.next_stop, bus);
        //     bus.eta_next_stop = here.travelTime;
        // }

        for (let i = 0; i < bings.length; i++) {
            bing = bings[i];
            bing.status = STATUS_ACTIVE;
            await Bus.find({imei: bing.bus_assign}).exec().then(res => {
                bus = res[0]
            });
            if (bus === undefined || bus === null) {
                continue;
            }

            try {
                let nextStop = bus.next_stop;
                let here = await Utils.rget(stops[nextStop], bus);
                bus.eta_next_stop = here.travelTime;
                bus.save();
            } catch (ignored) {

            }

            let eta = 0;
            eta = bus.eta_next_stop;
            for (let j = bus.next_stop; j < bing.id_stop; j++) {
                let stop = await Utils.findObjectByKey(stops, "num_stop", j);
                if (stop !== undefined && stop !== null) {
                    eta += stop.eta_stop;
                    console.log(j, eta);
                }
            }
            if (eta <= (bing.time * 60 + (2* 60)) && bing.status !== STATUS_FINISH) {
                bing.status = STATUS_FINISH;
                await Utils.sendPush(bing.id_user)
            }

            bing.save();

        }

        console.log("sincronizacion finalizada");
    }
}

module.exports = Schedule;