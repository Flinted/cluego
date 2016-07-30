
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
      this.game.changeToCreate();
    }.bind(this))
    var play = document.getElementById('play');
    play.addEventListener('click',function(){
      this.game.changeToPlay();
    }.bind(this))
    var toggle = document.getElementById('toggle');
    toggle.addEventListener('click',function(){
      this.game.map.toggleMarkers();
    }.bind(this))
  },
  
  // looks for clicks on map
  mapBindClick: function(){
    google.maps.event.addListener( this.game.map.googleMap, 'click', function(event){
      if(this.game.state === "create"){
        this.populateCreate(event);
      }else{
        this.populatePlay(event);
        console.log(this.game.currentObj.checkFound(event.latLng));
      }
    }.bind(this))
  },

  populateCreate: function(event){

    var info = document.getElementById('info');
    info.innerHTML = "<h1>Create</h1>"

    var p = document.createElement('p');
    p.innerHTML = "latitude:" + event.latLng.lat()

    var p2 = document.createElement('p');
    p2.innerHTML = "longitude:" + event.latLng.lng();

 //------------        form         ----------\\
    
    var form = document.createElement('form');
    form.id = "objective";
    var input = document.createElement('input');
    input.type = "text";
    input.value = "input";
    var button = document.createElement('input');
    button.type = "submit";
    button.value = "Submit";
    
    

    form.appendChild(input);
    form.appendChild(button);
    info.appendChild(form);
    
    var objective = document.getElementById( 'objective' );
    objective.addEventListener('submit', function(event){
      event.preventDefault()
      this.handleSubmit(event)
    }.bind(this))

 //------------        form        ----------\\

    info.appendChild(p);
    info.appendChild(p2);
  },

  handleSubmit: function(form){
    //take information from the form 
    //and send to objectives.JS.
    console.log("yeah", form)
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