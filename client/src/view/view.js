var state = {
 clue: "First Clue",
 hints: ["this", "that", "th'other"],
 tolerance: 0,
 foundMessage: "well done!"
}

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
        this.populateCreate(event);
        state.latlng = {lat: event.latLng.lat(), lng: event.latLng.lng()}
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
     input5.placeholder = "'found goal' message";

     var button = document.createElement('input');
     button.type = "submit";
     button.name = "enter";

     form.appendChild(input1);
     form.appendChild(input2);
     form.appendChild(input3);
     form.appendChild(input4);
     form.appendChild(input5);
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
     state.hints.push(event.srcElement[1].value)
     state.hints.push(event.srcElement[2].value)
     state.hints.push(event.srcElement[3].value)
     state.foundMessage = event.srcElement[4].value
     capturedState = state
     // console.log("your a state", capturedState)
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