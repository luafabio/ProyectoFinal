'use strict';
const https = require('https');

const APP_ID = 'DWUWUsbBLzKwS97z12IJ';
const APP_CODE = 'DIvI1yH_EVpeRg7489J5SA';


class Utils {

    static async rget(pos1, pos2) {  
        try {
            return new Promise((resolve, reject) => {
                let data = '';
                let summary = '';

                let url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${APP_ID}&app_code=${APP_CODE}&waypoint0=geo!${pos1[0]},${pos1[1]}&waypoint1=geo!${pos2[0]},${pos2[1]}&mode=fastest;car;traffic:disabled`;

                https.get(url, (res) => {
                    //console.log('statusCode:', res.statusCode);
                    //console.log('headers:', res.headers);

                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        data = JSON.parse(data);
                        resolve(data.response.route[0].summary);
                    });

                }).on('error', (e) => {
                  reject(e);
                })
            })

            res.send('ok');
            next();

        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    }

}
module.exports = Utils;