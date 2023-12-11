---
layout: page
title: Winter Bath
---

## Winter Bathing Status

{% assign num_entries = site.data.winter_bathing | size %}
{% assign last_dip = site.data.winter_bathing | sort: 'date' | last %}
{% assign formatted_date = last_dip.date | date: "%A, %-d %B %Y" %}

{% assign warmest_air = site.data.winter_bathing | sort: 'air_temperature' | last %}
{% assign warmest_local_sea = site.data.winter_bathing | sort: 'local_sea_temperature' | last %}

{% assign coolest_air = site.data.winter_bathing | sort: 'air_temperature' | first %}
{% assign coolest_local_sea = site.data.winter_bathing | sort: 'local_sea_temperature' | first %}

- **Last dip**: {{ formatted_date }}
- **Number of dips**: {{ num_entries }}
- **Coolest dip**: {{ coolest_local_sea.local_sea_temperature }}°C on {{ coolest_local_sea.date }}
- **Coolest air**: {{ coolest_air.air_temperature }}°C on {{ coolest_air.date }}
- **Warmest dip**: {{ warmest_local_sea.local_sea_temperature }}°C on {{ warmest_local_sea.date }}
- **Warmest air**: {{ warmest_air.air_temperature }}°C on {{ warmest_air.date }}



<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>

<div id="winterBathingChart" style="width:100%; height:400px;"></div>



<script>document.addEventListener('DOMContentLoaded', function() {

    var sealocalTemperatures = [{% for entry in site.data.winter_bathing %}
        {% assign date_parts = entry.date | split: "-" %}
        [Date.UTC({{ date_parts[0] }}, {{ date_parts[1] | minus: 1 }}, {{ date_parts[2] }}), {{ entry.local_sea_temperature }}]
        {% unless forloop.last %},{% endunless %}
    {% endfor %}];
    
    var seaofficalTemperature = [{% for entry in site.data.winter_bathing %}
        {% assign date_parts = entry.date | split: "-" %}
        [Date.UTC({{ date_parts[0] }}, {{ date_parts[1] | minus: 1 }}, {{ date_parts[2] }}), {{ entry.official_sea_temperature }}]
        {% unless forloop.last %},{% endunless %}
    {% endfor %}];

    var airTemperatures = [{% for entry in site.data.winter_bathing %}
        {% assign date_parts = entry.date | split: "-" %}
        [Date.UTC({{ date_parts[0] }}, {{ date_parts[1] | minus: 1 }}, {{ date_parts[2] }}), {{ entry.air_temperature }}]
        {% unless forloop.last %},{% endunless %}
    {% endfor %}];
    
    var bathingDates = [{% for entry in site.data.winter_bathing %}
        {% assign date_parts = entry.date | split: "-" %}
        {
            x: Date.UTC({{ date_parts[0] }}, {{ date_parts[1] | minus: 1 }}, {{ date_parts[2] }}),
            y: 0,
            sauna_type: "{{ entry.sauna_type }}",
            color: {% if entry.sauna_type == 'traditional' %}'red'{% elsif entry.sauna_type == 'infrared' %}'purple'{% else %}'black'{% endif %}
        }
        {% unless forloop.last %},{% endunless %}
    {% endfor %}];


    var startYear = new Date(sealocalTemperatures[0][0]).getUTCFullYear();
    var endYear = new Date(sealocalTemperatures[sealocalTemperatures.length - 1][0]).getUTCFullYear();

    var plotBands = [];
    for (var year = startYear; year <= endYear; year++) {
        plotBands.push({
            from: Date.UTC(year, 9, 1),
            to: Date.UTC(year + 1, 4, 1),
            color: 'rgba(173, 216, 230, 0.2)',
            label: {
                text: 'Winter Bathing Season'
            }
        });
    }

    Highcharts.chart('winterBathingChart', {
        title: { text: 'Graph' },
        xAxis: {
            type: 'datetime',
            title: { text: 'Date', align: 'middle' },
            plotBands: plotBands
        },
        yAxis: {
            title: { text: 'Temperature (°C)', align: 'middle' }
        },
        series: [{
            name: 'Offical Sea Temperature',
            data: seaofficalTemperature,
            color: 'lightblue',
            type: 'spline',
            lineWidth: 2,
            dashStyle: 'ShortDash',
            zIndex: 1
        }, {
            name: 'Local Sea Temperature',
            data: sealocalTemperatures,
            color: '#336699',
            type: 'spline',
            lineWidth: 2,
            zIndex: 3
        }, {
            name: 'Air Temperature',
            data: airTemperatures,
            color: '#b3262a',
            type: 'spline',
            lineWidth: 2,
            zIndex: 2
        }
        , {
            name: 'Sauna Type',
            data: bathingDates,
            type: 'spline',
            color: 'black',
            lineWidth: 0,
            marker: {
                enabled: true,
                symbol: 'square',
                radius: 3
            },
            zIndex: 2,
            tooltip: {
                pointFormat: 'Sauna Type: {point.sauna_type}'
            }  
        }
        ],
        credits: { enabled: false }
    });
});
</script>
