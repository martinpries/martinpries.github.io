---
layout: page
title: Winter Bath
---

## Winter Bath Status

{% assign num_entries = site.data.winter_bathing | size %}
{% assign warmest_air = site.data.winter_bathing | sort: 'air_temperature' | last %}
{% assign warmest_local_sea = site.data.winter_bathing | sort: 'local_sea_temperature' | last %}

{% assign coolest_air = site.data.winter_bathing | sort: 'air_temperature' | first %}
{% assign coolest_local_sea = site.data.winter_bathing | sort: 'local_sea_temperature' | first %}

- **Number of Entries**: {{ num_entries }}
- **Coolest Air Temperature** on {{ coolest_air.date }}: {{ coolest_air.air_temperature }}°C
- **Coolest Sea Local Temperature** on {{ coolest_local_sea.date }}: {{ coolest_local_sea.local_sea_temperature }}°C
- **Warmest Air Temperature** on {{ warmest_air.date }}: {{ warmest_air.air_temperature }}°C
- **Warmest Sea Local Temperature** on {{ warmest_local_sea.date }}: {{ warmest_local_sea.local_sea_temperature }}°C

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>

<canvas id="winterBathingChart" width="400" height="200"></canvas>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var dates = [{% for entry in site.data.winter_bathing %}"{{ entry.date }}",{% endfor %}];
    var sealocalTemperatures = [{% for entry in site.data.winter_bathing %}{{ entry.local_sea_temperature }},{% endfor %}];
    var officialSeaTemperatures = [{% for entry in site.data.winter_bathing %}{{ entry.official_sea_temperature }},{% endfor %}];
    var airTemperatures = [{% for entry in site.data.winter_bathing %}{{ entry.air_temperature }},{% endfor %}];

    var ctx = document.getElementById('winterBathingChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.reverse(),
            datasets: [{
                label: 'Local Sea Temperature',
                data: sealocalTemperatures.reverse(),
                borderColor: '#336699',
                fill: false,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: 'black',
                    formatter: function(value, context) {
                        return value + '°C';
                    }
                }
            }, {
                label: 'Official Sea Temperature',
                data: officialSeaTemperatures.reverse(),
                borderColor: 'lightblue',
                fill: false,
                borderDash: [3,3]
            }, {
                label: 'Air Temperature',
                data: airTemperatures.reverse(),
                borderColor: '#b3262a',
                fill: false
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°C)'
                    }
                }]
            },
            plugins: {
                datalabels: {
                    display: true
                }
            }
        }
    });
});
</script>
