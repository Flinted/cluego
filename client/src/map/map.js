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
}

Map.prototype = {
  // returns marker and adds to map
  addMarker: function(latLng){
    var marker = new google.maps.Marker({
      position:  latLng,
      map: this.googleMap
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
  
    addRectangle: function(latLng, tolerance){new google.maps.Rectangle({
              strokeColor: 'black',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: 'wheat',
              fillOpacity: 0.35,
              map: this.googleMap,
              bounds: {
                north: 51.4705,
                south: 51.4695,
                east: -0.4535,
                west: -0.4551
              }
            });
  }


  // addCircle: function(latLng, tolerance){ new google.maps.Circle({
  //   strokeColor: 'black',
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: 'wheat',
  //   fillOpacity: 0.35,
  //   map: this.googleMap,
  //   center: latLng,
  //   radius: tolerance
  // });
}



module.exports = Map
