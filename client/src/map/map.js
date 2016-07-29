var Map = function(latLng, zoom){
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: zoom,
    zoomControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER
    }
  });

  // returns marker and adds to map
  this.addMarker = function(latLng){
    var marker = new google.maps.Marker({
      position:  latLng,
      map: this.googleMap
    })
    return marker;   
  }; 

  // creates marker and info window
  this.addInfoWindow = function(latLng, content){
    var marker = this.addMarker(latLng);
    state.markers.push(marker)
    marker.addListener('click', function(event){
      state.infoWindow.close()
      var infoWindow = new google.maps.InfoWindow({
        content: content
      })
      state.infoWindow = infoWindow
      infoWindow.open( this.map, marker ) 
    })
  };
  // // looks for clicks on map
  // this.bindClick = function(){
  //   google.maps.event.addListener( this.googleMap, 'click', function(event){
  //     if(this.state === "create"){console.log('createMode')}else{console.log("Playmode")}
  //   }.bind(this))
  // };
}


module.exports = Map
