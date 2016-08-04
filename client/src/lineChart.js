var LineChart = function(data,categories){

  var container = document.getElementById("lineChart");
  

  var chart = new Highcharts.Chart({
    chart: {
      type: "spline",
      renderTo: container,
      backgroundColor: 'rgba(220, 220, 220, 1)',
       style: {
        fontFamily: 'Special Elite'
      }
    },
    title: {
      text: "ClueGo"
    },
    yAxis: {
      title: {
        text: 'Points'
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      plotBands: [{ 
       from: 0.5,
       to: 2.5,
       color: 'rgba(245, 245, 245, 1)',
       label: {
         text: 'no points',
         style: {
           color: '#606060'
         }
       }
     },
   { // Light air
     from: 3.5,
     to: 4.5,
     color: 'rgba(245, 245, 245, 1)',
     label: {
       text: '4th to find',
       style: {
         color: '#606060'
       }
     }
   },
   { // Light air
     from: 5.5,
     to: 6.5,
     color: 'rgba(245, 245, 245, 1)',
     label: {
       text: '3rd to find',
       style: {
         color: '#606060'
       }
     }
   },
   { // Light air
    from: 7.5,
    to: 8.5,
    color: 'rgba(245, 245, 245, 1)',
    label: {
      text: '2nd to find',
      style: {
        color: '#606060',
        
        
      }
    }
  },

    { // Light air
     from: 9.5,
     to: 10.5,
     color: 'rgba(200, 200, 200, 1)',
     label: {
       text: '1st to find!',
       style: {
         color: '#606060'
       }
     }
   }]
 },
 series: data,

 xAxis: {
  categories: categories
}


})

}

module.exports = LineChart;