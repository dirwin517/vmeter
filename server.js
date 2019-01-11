let express = require('express');
let app = express();
let sse = require('server-side-event')(10000);// the retry time, default 15 second , unit ms
let fs = require('fs');

let EtekCity = require('etekcity-smartplug');

const config = require('./config.json');

(async function () {
    let client = new EtekCity();
    await client.login(config.user, config.pass);

    let devices = (await client.getDevices());

    app.get('/energy', function (req, res) {
        sse(res);

        let updateMeters = () => {
            devices.forEach(async (device) => {
                try {
                    let meter = await client.getMeter(device.id);

                    let rawMeterData = {
                        name: device.name,
                        deviceId: device.id,
                        power: meter.power,
                        voltage: meter.voltage
                    };

                    console.log('RAW', rawMeterData);

                    res.push(rawMeterData);
                }
                catch(e){}
            })
        };

        let intv = setInterval(updateMeters, 3 * 60 * 1000);//poll every 3 minutes thats about how often etek updates

        res.on('timeout', () => clearInterval(intv));
        res.on('error', () => clearInterval(intv));
        res.on('close', () => clearInterval(intv));
        res.on('end', () => clearInterval(intv));

        updateMeters();
    });


    app.get('/', (req, res) => {
        res.end(fs.readFileSync('./www/index.html', 'utf8'));
    });

    app.get('/app.js', (req, res) => {
        res.end(fs.readFileSync('./www/app.js', 'utf8'));
    });

    app.get('/hctheme.js', (req, res) => {
        res.end(fs.readFileSync('./www/hctheme.js', 'utf8'));
    });

    app.listen(9001);
})();