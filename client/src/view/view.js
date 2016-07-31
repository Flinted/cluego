var state = {
 clue: "",
 hints: [],
 tolerance: 100,
 foundMessage: "",
 latLng: ''
}

var View = function(game){
  this.game = game;
  this.readyForNext = true;
  this.ran = false;
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
      this.populatePlay()
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
        state.latLng = {lat: event.latLng.lat(), lng: event.latLng.lng()}
        if(this.ran){
          this.game.map.markers[this.game.map.markers.length-1].setVisible(false)
          this.game.map.circles[this.game.map.circles.length-1].setVisible(false)
          this.game.map.markers.pop()
          this.game.map.circles.pop()
        }
        this.ran = true;
        this.game.map.addInfoWindow(state.latLng);
        this.game.map.drawCircle(state.latLng, state.tolerance)
     
        if (this.readyForNext){
        this.readyForNext = false;
        this.populateCreate(event);}
      }else{
        this.populatePlay(event);
        this.game.currentObj.checkFound(event.latLng);
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
     
     var form = document.createElement('form');
     form.id = "objective";

     var input1 = document.createElement('input');
     input1.type = "text";
     input1.name = "question";
     input1.required = true;
     input1.placeholder = "Question";

     var input2 = document.createElement('input');
     input2.type = "text";
     input2.name = "hint1";
     input2.placeholder = "Hint 1";

     var input3 = document.createElement('input');
     input3.type = "text";
     input3.name = "hint2";
     input3.placeholder = "Hint 2";

     var input4 = document.createElement('input');
     input4.type = "text";
     input4.name = "hint3";
     input4.placeholder = "Hint 3";

     var input5 = document.createElement('input');
     input5.type = "text";
     input5.name = "foundMessage";
     input5.required = true;
     input5.placeholder = "'found goal' message";

     var input6 = document.createElement('input');
     input6.type = "number";
     input6.name = "setTolerance";
     input6.value = state.tolerance;
     input6.addEventListener('change', function(event){
       state.tolerance = Number(event.target.value)
       this.game.map.drawCircle(state.latLng, state.tolerance)
     }.bind(this))

     var button = document.createElement('input');
     button.type = "submit";
     button.name = "enter";

     form.appendChild(input1);
     form.appendChild(input2);
     form.appendChild(input3);
     form.appendChild(input4);
     form.appendChild(input5);
     form.appendChild(input6);
     form.appendChild(button);
     info.appendChild(form);
     info.appendChild(p);
     info.appendChild(p2);

     var objective = document.getElementById( 'objective' );
     objective.addEventListener('submit', function(event){
      event.preventDefault()
      this.handleSubmit(event)
    }.bind(this))
   },

   handleSubmit: function(event){
     state.clue = event.srcElement[0].value
     state.hints=[event.srcElement[1].value,
                  event.srcElement[2].value, 
                  event.srcElement[3].value]
     state.foundMessage = event.srcElement[4].value
     var capturedState = state
     this.game.createObjective(capturedState)
     this.game.map.addPath();
     this.ran = false
   },


   populatePlay: function(){
     var info = document.getElementById('info');
     info.innerHTML = "<h1>Play</h1><br>Here is your first clue: <br>" + state.clue + "<br>"
     console.log(state.hints[0])

     var button = document.createElement('button');
     button.innerHTML = "Get a Hint"
     button.addEventListener('click', function(event){
     // var = i
       for (i = 0; i < state.hints.length; i++){
       info.innerHTML += state.hints[i]
     console.log('clicked', i);}
       
     })
     info.appendChild(button);
   },

   foundCorrectLocation: function(){
     var info = document.getElementById('info');
     info.innerHTML = state.foundMessage
   }

  }

  module.exports = View;