
var View = function(game){
  this.game = game;
}

View.prototype = {
  initialise: function(){
    this.mapBindClick();
    this.setButtons();
  },

  setButtons: function(){
    var create = document.getElementById('create');
    create.addEventListener('click',function(){
      this.game.changeState();
    }.bind(this))
    var play = document.getElementById('play');
    play.addEventListener('click',function(){
      this.game.changeState();
    }.bind(this))
  },
  
  // looks for clicks on map
  mapBindClick: function(){
    google.maps.event.addListener( this.game.map.googleMap, 'click', function(event){
      if(this.game.state === "create"){
        this.populateCreate(event);
      }else{
        this.populatePlay(event);
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
    var button = document.createElement('button');
    button.innerHTML= "Get a Hint"
    button.addEventListener('click', function(event){
      console.log('clicked');
    })
    info.appendChild(button);
  }


}

module.exports = View;