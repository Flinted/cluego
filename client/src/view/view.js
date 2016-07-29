
var View = function(game){
  this.game = game;
}

View.prototype = {
  initialise: function(){
    this.mapBindClick();
  },

  // looks for clicks on map
  mapBindClick: function(){
    google.maps.event.addListener( this.game.map.googleMap, 'click', function(event){
      if(this.game.state === "create"){
        this.populateCreate(event);
        this.game.changeState();
      }else{
        this.populatePlay(event);
        this.game.changeState();
      }
    }.bind(this))
  },

  populateCreate: function(event){
    var info = document.getElementById('info');
    info.innerHTML = "<h1>Create</h1>"
    var p = document.createElement('p');
    p.innerHTML = "latitude:" + event.latLng.lat()
    var p2 = document.createElement('p');
    p2.innerHTML = "longitude:" + event.latLng.lng()

    info.appendChild(p);
    info.appendChild(p2);

  },

  populatePlay: function(){
    var info = document.getElementById('info');
    info.innerHTML = "<h1>Play</h1>"
  }


}

module.exports = View;