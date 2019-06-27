'use strict';
const https = require('https');

const APP_ID = 'DWUWUsbBLzKwS97z12IJ';
const APP_CODE = 'DIvI1yH_EVpeRg7489J5SA';
const FCM = require('fcm-node');


class Utils {

    static async sendPush(id_user) {
        let serverKey = 'AAAA2bmVM5g:APA91bG-qZT_7x8jsaSeQhx6NnLT3t0q-_R2CoJd2OI_X26Vq_zJ31ddMjlzJMmVIZj39bVnVGgpcOoeprRaMfdf_nBYHZerhKPmjYgJAJHPwTt_jCCfwuB3kQCkWsvjpDJqIY1UWWnM';
        let fcm = new FCM(serverKey);

        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: id_user,

            notification: {
                title: 'Hermes',
                body: 'Tu colectivo se acerca a la parada!'
            },
        };

        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }

    static async rget(pos1, pos2) {
        try {
            return new Promise((resolve, reject) => {
                let body = [];
                let url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${APP_ID}&app_code=${APP_CODE}&waypoint0=geo!${pos1.lat},${pos1.long}&waypoint1=geo!${pos2.lat},${pos2.long}&mode=shortest;publicTransport;traffic:enabled`;

                https.get(url, (res) => {
                    res.on('data', (chunk) => {
                        body.push(chunk);
                    });

                    res.on('end', (e) => {
                        let data = JSON.parse(Buffer.concat(body).toString());

                        if (data.response !== undefined && data.response.route[0] !== undefined) {
                            resolve(data.response.route[0].summary);
                        } else {
                            reject(e);

                        }
                    });

                }).on('error', (e) => {
                    reject(e);
                })
            });
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    }

    static async findObjectByKey(array, key, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    static async distance(bus, stop) {
        return Math.sqrt(Math.pow(stop.lat - bus.lat, 2) + Math.pow(stop.long - bus.long, 2)) * 10000
    }

}

module.exports = Utils;
