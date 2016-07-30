var Map = function(latLng, zoom){
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: zoom,
    zoomControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER
    }
  });

  this.infoWindow = new google.maps.InfoWindow({
    content: ""
  })

  this.markers = []
  this.circles = []
  this.path = ''
}

Map.prototype = {
  // returns marker and adds to map
  addMarker: function(latLng){
    var marker = new google.maps.Marker({
      position:  latLng,
      map: this.googleMap,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5
      },
    })
    return marker;   
  }, 

  // creates marker and info window
  addInfoWindow: function(latLng, content){
    var marker = this.addMarker(latLng);
    this.markers.push(marker)
    marker.addListener('click', function(event){
      this.infoWindow.close();
      var infoWindow = new google.maps.InfoWindow({
        content: content
      })
      this.infoWindow = infoWindow;
      infoWindow.open( this.map, marker ); 
    }.bind(this))
  },
  
//   addRectangle: function(latLng, tolerance){new google.maps.Rectangle({
//     strokeColor: 'black',
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: 'wheat',
//     fillOpacity: 0.35,
//     map: this.googleMap,
//     bounds: {
//       north: 51.4705,
//       south: 51.4695,
//       east: -0.4535,
//       west: -0.4551
//     }
//   });
// },

  // connects all markers in the array
  addPath: function(markers){
    var markerPath = [];
    this.markers.forEach(function(marker){
      var latLng = {lat: marker.position.lat(), lng: marker.position.lng()}
      markerPath.push(latLng)
    })
    this.path = new google.maps.Polyline({
      path: markerPath,
      geodesic: true,
      strokeColor: 'black',
      strokeOpacity: 0.4,
      strokeWeight: 6
    });
    this.path.setMap(this.googleMap)
  },


  addCircle: function(latLng, tolerance){ new google.maps.Circle({
    strokeColor: 'black',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'wheat',
    fillOpacity: 0.35,
    map: this.googleMap,
    center: latLng,
    radius: tolerance
  })
},

addArrow: function(){
            // Create the polyline and add the symbol via the 'icons' property.
            var line = new google.maps.Polyline({
              path: [{lat: 22.291, lng: 153.027}, {lat: 18.291, lng: 153.027}],
              icons: [{
                icon: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                offset: '100%'
              }],
              map: this.googleMap
            });
          }

        }



        module.exports = Map
