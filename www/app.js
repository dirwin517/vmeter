let evtSource = new EventSource("energy");

// some code stolen from https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/gauge-vu-meter/

let plotBands = [{
    from: 0,
    to: 100,
    color: '#FFCD00',
    innerRadius: '100%',
    outerRadius: '105%'
},
    {
        from: 100,
        to: 140,
        color: '#00FF00',
        innerRadius: '100%',
        outerRadius: '105%'
    },
    {
        from: 140,
        to: 200,
        color: '#C02316',
        innerRadius: '100%',
        outerRadius: '105%'
    }];

let container = document.getElementById('container');

Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = HCTHEME;

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

let meterValues = {};

evtSource.onmessage = function (e) {

    let meterData = JSON.parse(e.data);

    console.log('GOT ENERGY DATA', meterData);

    meterValues[meterData.name] = meterData.power;

    let div = document.getElementById(meterData.name);
    if (!div) {
        div = document.createElement('div');
        div.classList.add('floating');
        div.id = meterData.name;
        container.append(div);
    }

    function sortThem(s) {
        return Array.prototype.slice.call(document.body.querySelectorAll(s)).sort(function sort (ea, eb) {
            if (ea.id < eb.id) return -1;
            if (ea.id > eb.id) return 1;
            return 0;
        }).map(function(div) {
            div.parentElement.appendChild(div);
            return div.id
        });
    }
// call it like this
    console.log('ids', sortThem('div.floating'))

    Highcharts.chart(div, HCCHART(meterData.name, {
        name: meterData.name,
        data: [meterData.power],
        dataLabels: {
            format : '<span style=";color:#ffffff;font-size: 30px;">{y:.1f} Watts</span>',
            borderWidth: 0,
            style: {
                textOutline: 0,
                textShadow: false
            },
        },

        yAxis: 0
    }));


    Highcharts.chart(div, HCCHART(meterData.name, {
        name: 'Apartment (total)',
        data: [Object.keys(meterValues).reduce((acc, key) => acc+=meterValues[key], 0)],
        dataLabels: {
            format : '<span style=";color:#ffffff;font-size: 30px;">{y:.1f} Watts</span>',
            borderWidth: 0,
            style: {
                textOutline: 0,
                textShadow: false
            },
        },

        yAxis: 0
    }));
};
