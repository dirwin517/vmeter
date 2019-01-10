let evtSource = new EventSource("energy");

// some code stolen from https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/gauge-vu-meter/

let plotBands = [{
    from: 0,
    to: 6,
    color: '#FFCD00',
    innerRadius: '100%',
    outerRadius: '105%'
},
    {
        from: 6,
        to: 60,
        color: '#00FF00',
        innerRadius: '100%',
        outerRadius: '105%'
    },
    {
        from: 60,
        to: 100,
        color: '#C02316',
        innerRadius: '100%',
        outerRadius: '105%'
    }];

let container = document.getElementById('container');

evtSource.onmessage = function (e) {

    let meterData = JSON.parse(e.data);

    console.log('GOT ENERGY DATA', meterData);

    let div = document.getElementById(meterData.name);
    if (!div) {
        div = document.createElement('div');
        div.classList.add('container');
        div.id = meterData.name;
        container.append(div);
    }

    Highcharts.chart(div, {

        chart: {
            type: 'gauge',
            plotBorderWidth: 1,
            plotBackgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, '#FFF4C6'],
                    [0.3, '#FFFFFF'],
                    [1, '#FFF4C6']
                ]
            },
            plotBackgroundImage: null,
            height: 200
        },

        title: {
            text: meterData.name
        },

        pane: [{
            startAngle: -45,
            endAngle: 45,
            background: null,
            center: ['25%', '145%'],
            size: 300
        }],

        tooltip: {
            enabled: false
        },

        yAxis: [{
            min: 0,
            max: 100,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: 20
            },
            plotBands: plotBands,
            pane: 0,
            title: {
                text: 'Watts',
                y: -40
            }
        }],

        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: false
                },
                dial: {
                    radius: '100%'
                }
            }
        },


        series: [{
            name: meterData.name,
            data: [meterData.power],
            yAxis: 0
        }]

    });
};
