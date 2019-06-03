'USE strict';
const https = require('https');

const APP_ID = 'DWUWUsbBLzKwS97z12IJ';
const APP_CODE = 'DIvI1yH_EVpeRg7489J5SA';


class Utils {

    static async rget(pos1, pos2) {  
        try {
            return new Promise((resolve, reject) => {
                let data = '';

                let url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${APP_ID}&app_code=${APP_CODE}&waypoint0=geo!${pos1.lat},${pos1.long}&waypoint1=geo!${pos2.lat},${pos2.long}&mode=fastest;car;traffic:disabled`;

                https.get(url, (res) => {
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', (e) => {

                        data = JSON.parse(data);
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

        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    }

    static async findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    static async distance(bus, stop) {
        return ((stop.lat - bus.lat) ^ 2 + (stop.long - bus.long) ^ 2) ^ (1 / 2)
    }

}
module.exports = Utils;
