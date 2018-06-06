$(function() {

  var data = {}

  Highcharts.data({
    googleSpreadsheetKey: '1z3i0mILf9PGGhCh42lSh6BejOt9P3eolANl8ic0MnZA',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }

          if (code[0] == 'column') {
            data[code[1]] = data[code[1]] || {
              type: code[0],
              name: code[1],
              data: []
            }
            data[code[1]].data.push({
              x: code[2],
              y: code[3]
            })

          } else if (code[0] == 'spline') {
            data[code[1]] = data[code[1]] || {
              type: code[0],
              name: code[1],
              dashStyle: code[4],
              yAxis: 1,
              data: [],
              marker: {
                enabled: false,
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[4],
                fillColor: 'white'
              }
            }

            data[code[1]].data.push({
              x: code[2],
              y: code[3]/1000
            })

          }

        })

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });
        renderChart(dataArray);

      }
  })


  function renderChart(data) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        zoomType: 'x',
      },
      // Chart Title and Subtitle
      title: {
        text: "Army End Strength and Budget, FY 1975 to FY 2018"
      },
      subtitle: {
        text: "Click and drag to zoom in"
      },
      // Credits
      credits: {
        position: {
          y: -15
        },
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Source: NAME"
      },
      // Chart Legend
      legend: {
        y: -15,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      },
      // X Axis
      xAxis: {
        title: {
          text:"Year"
        },
        labels: {
            rotation: -90,
            formatter: function() {
              var yearStr = this.value.toString();
              var twoDigitsYear = yearStr.slice(2);
              return 'FY' + twoDigitsYear;
            }
        },
        tickInterval: 1,
        allowDecimals: false
      },
      // Y Axis
      yAxis: [{ // Primary yAxis
          title: {
              text: 'Army End Strength',
              rotation: 90,
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          labels: {
              style: {
                  color: Highcharts.getOptions().colors[1]
              },
              format: '{value}k'
          },
          reversedStacks: false
      }, { // Secondary yAxis
          title: {
              text: 'Discretionary & Mandatory Budget Authority (in FY19 Dollars)',
              style: {
                  color: Highcharts.getOptions().colors[4]
              }
          },
          labels: {
              style: {
                  color: Highcharts.getOptions().colors[4]
              },
              format: '${value}B'
          },
          max: 300,
          /*
          tickInterval: 25,
          */
          opposite: true
      }],
      series: data,
      // Tooltip
      tooltip: {
          formatter: function () {

              var unit;
              var chartType = this.series.userOptions.type;
              var rounded = Number(Math.round(this.y + 'e2')+ 'e-2');

              if (chartType == "spline") {
                unit = " Billion";
              } else if (chartType == "column") {
                unit = "k"
              }
              return '<b>' + this.key + '</b>' + '<br/><span style="color:' + this.series.color + '">● </span>' + this.series.name + ': ' + rounded + unit;
          }
      },
      // Additional Plot Options
      plotOptions:
      {
        column: {
          stacking: "normal",
        }
      }
    });
  }
});
