'use strict';

const Bus = require('./models/Bus');
const Stop = require('./models/Stop');
const Bing = require('./models/Bing');

const Utils = require('./utils');
const http = require('http')

const STATUS_ACTIVE ='Activa';
const STATUS_FINISH = 'Finalizada';

class Schedule {



    async sendPush() {

        const options = {
            hostname: 'https://fcm.googleapis.com/fcm',
            path: '/send',
            method: 'POST',
            headers: {
                'Authorization': 'key=AAAA2bmVM5g:APA91bG-qZT_7x8jsaSeQhx6NnLT3t0q-_R2CoJd2OI_X26Vq_zJ31ddMjlzJMmVIZj39bVnVGgpcOoeprRaMfdf_nBYHZerhKPmjYgJAJHPwTt_jCCfwuB3kQCkWsvjpDJqIY1UWWnM',
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
    }

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


        await Bing.find({}).exec().then(res => {
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
                let stop = await Utils.findObjectByKey(this.stops, "num_stop", j);
                if (stop !== undefined && stop !== null) {
                    eta += stop.eta_stop;
                }
            }
            if (eta <= this.bing.time * 60) {
                this.bing.status = STATUS_FINISH;
                await this.sendPush()
            }

        }

        console.log("sincronizacion finalizada");
    }
}

module.exports = Schedule;