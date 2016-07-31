  var styles = [
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#80d4f6" }
    ]
  },{
    "featureType": "landscape.natural.terrain",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "saturation": 22 },
      { "gamma": 0.56 },
      { "lightness": 60 },
      { "color": "#a5d296" }
    ]
  },{
    "elementType": "labels.text.fill",
    "stylers": [
      { "weight": 2.1 },
      { "lightness": 100 },
      { "invert_lightness": true }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "color": "#8c9184" },
      { "lightness": 15 }
    ]
  },{
    "featureType": "administrative.country",
    "elementType": "labels.text",
    "stylers": [
      { "saturation": 100 },
      { "weight": 0.6 }
    ]
  }
]




var Map = function(latLng, zoom){
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: zoom,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT 
    }
  });

  this.infoWindow = new google.maps.InfoWindow({
    content: ""
  })
  this.markers = [];
  this.circles = [];
  this.path = ''
}

Map.prototype = {
  initialise: function(){
    this.googleMap.setOptions({styles: styles})
  },
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
    this.markers.push(marker);
    marker.addListener('click', function(event){
      this.infoWindow.close();
      var infoWindow = new google.maps.InfoWindow({
        content: content
      })
      this.infoWindow = infoWindow;
      infoWindow.open( this.map, marker ); 
    }.bind(this))
  },
  
  // changes markers, paths and circles to visible or hidden
  toggleMarkers: function(){
    if(this.markers[0].visible === false){var setter = true}else{var setter = false}

      for(marker of this.markers){
        marker.setVisible(setter);
      }
      for(circle of this.circles){
        circle.setVisible(setter);
      }
      this.path.setVisible(setter);
    },

  // connects all markers in the array
  addPath: function(){
    var markerPath = [];
    this.markers.forEach(function(marker){
      var latLng = {lat: marker.position.lat(), lng: marker.position.lng()}
      markerPath.push(latLng);
    })
    this.path = new google.maps.Polyline({
      path: markerPath,
      geodesic: true,
      strokeColor: 'black',
      strokeOpacity: 0.2,
      strokeWeight: 6
    });
    this.path.setMap(this.googleMap);
  },

  // shows circle around marker based on tolerance
  drawCircle: function(latLng, tolerance){ 
    var circle = new google.maps.Circle({
      strokeColor: 'black',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'wheat',
      fillOpacity: 0.35,
      geodesic: false,
      clickable: false,
      map: this.googleMap,
      center: latLng,
      radius: tolerance
    })
    this.circles.push(circle);
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



        module.exports = Map;
