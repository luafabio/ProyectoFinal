'use strict';
const https = require('https');

const APP_ID = 'DWUWUsbBLzKwS97z12IJ';
const APP_CODE = 'DIvI1yH_EVpeRg7489J5SA';
const FCM = require('fcm-node');
const axios = require('axios');

class Utils {

    static async sendPush(id_user) {
        let serverKey = 'AAAA2bmVM5g:APA91bG-qZT_7x8jsaSeQhx6NnLT3t0q-_R2CoJd2OI_X26Vq_zJ31ddMjlzJMmVIZj39bVnVGgpcOoeprRaMfdf_nBYHZerhKPmjYgJAJHPwTt_jCCfwuB3kQCkWsvjpDJqIY1UWWnM';
        let fcm = new FCM(serverKey);

        let message = {
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
        return new Promise((resolve, reject) => {
            axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${pos1.lat},${pos1.long}&destination=${pos2.lat},${pos2.long}&key=AIzaSyBCXAzjr6KjZZDAyLu_P8co4UgX8aL78vU`)
                .then(response => {
                    resolve(Number.parseInt(response.data.routes[0].legs[0].duration.value));
                })
                .catch(error => {
                    reject(error);
                });
        });
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

    static async calculateDistance(bus, stop) {
        let eta_next_stop = 0;

        try {
            eta_next_stop = await Utils.rget(bus, stop);
        } catch (ignored) {
            console.log("err")
        }
        if (eta_next_stop >= stop.eta_stop || eta_next_stop === undefined || eta_next_stop <= 0) {
            eta_next_stop = stop.eta_stop / 2;
            console.log("cambio: ", eta_next_stop);
        }
        return eta_next_stop
    }

}

module.exports = Utils;
