function chartLineGraph(id, graphTitle, xTitle, yTitle, dataUrl) {
  $.ajax({url: dataUrl, success: function(dataJson) {
    if((typeof dataJson) === "string") {
      dataJson = JSON.parse(dataJson);
    }
    var labels = Object.keys(dataJson);
    var values = Object.values(dataJson);
    var ctx = $(`#${id}`)[0].getContext('2d');;
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          borderColor: '#36a2eb',
          borderWidth: 1,
          backgroundColor: '#84CBFA',
          data: values
        },]
      },
      //HERE COMES THE AXIS Y LABEL
      options : {
        responsive: true,
        title: {
  				display: true,
  				text: graphTitle
  			},
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yTitle
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: xTitle
            }
          }]
        }
      }
    });
    /*var graph = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            borderColor: '#36a2eb',
            borderWidth: 1,
            backgroundColor: '#84CBFA',
            data: [1,2,4,5,6,7,8]
          }]
        },
        options: {
          responsive: true,
          animation:{
            duration:0
          },
          title: {
            display: true,
            text: graphTitle
          },
          legend: {
            display: false
          },
          tooltips: {
  					mode: 'index',
  					intersect: false,
  				},
  				hover: {
  					mode: 'nearest',
  					intersect: true
  				},
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: xTitle
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: yTitle
              }
            }]
          }
        }
      });**/
    }
  });
}
