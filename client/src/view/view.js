var state = {
 clue: "",
 hints: [],
 tolerance: 100,
 foundMessage: "",
 latLng: '',
 currTeam: ''
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
    state.currTeam = this.game.teams[0]
  },

  setButtons: function(){
    var create = document.getElementById('create');
    create.addEventListener('click',function(){
      this.goCreate()
    }.bind(this))
    var play = document.getElementById('play');
    play.addEventListener('click',function(){
        this.goPlay()
    }.bind(this))
  },
  
  goPlay: function(){
    this.game.map.hideMarkers();
    this.selectTeam();
    this.populatePlay()
    this.game.changeToPlay();
  },

  goCreate: function(){
    this.game.changeToCreate();
    this.setVisible("create")
  },

  setVisible: function(area){
    var temp = document.getElementById('temp');
    var create = document.getElementById('createArea');
    var play = document.getElementById('playArea');
    if(area === "temp"){temp.style.display = "block"}else{temp.style.display='none'}
    if(area === "create"){create.style.display = "block"}else{create.style.display='none'}
    if(area === "play"){play.style.display = "block"}else{play.style.display='none'}
  },

  // looks for clicks on map
  mapBindClick: function(){
    google.maps.event.addListener( this.game.map.googleMap, 'click', function(event){
      this.game.map.googleMap.panTo(event.latLng)
      state.latLng = {lat: event.latLng.lat(), lng: event.latLng.lng()}

      if(this.game.state === "create"){
        if(this.ran){
          this.resetMarkers();
        }
        this.ran = true;
        this.game.map.addInfoWindow(state.latLng);
        this.game.map.drawCircle(state.latLng, state.tolerance);
        
        if (this.readyForNext){
          this.readyForNext = false;
          this.populateCreate(event);}
        }else{
          if(this.game.currentObj.checkFound(event.latLng)){
            this.game.map.addFoundWindow(this.game.currentObj.latLng, this.game.currentObj.clue + " " + this.game.currentObj.foundMessage)
            this.popFound();
            if(this.game.updateCurrent()){
              this.endGame()
            }else{
              this.populatePlay(event)
            }
          }
        }
      }.bind(this))
  },

  resetMarkers: function(){
    this.game.map.markers[this.game.map.markers.length-1].setVisible(false)
    this.game.map.circles[this.game.map.circles.length-1].setVisible(false)
    this.game.map.markers.pop()
    this.game.map.circles.pop()
  },

  selectTeam: function(){
    var temp = document.getElementById('temp');
    var input1 = document.createElement('input');
    var header = document.createElement('h1');
    this.setVisible("temp")
    
    header.innerHTML = "Please enter Player Name"
    input1.type = "text";
    input1.name = "name";
    input1.required = true;
    input1.placeholder = "Enter Player Name";
    temp.innerHTML=''
    temp.appendChild(document.createElement('br'));
    temp.appendChild(document.createElement('br'));
    temp.appendChild(document.createElement('br'));
    temp.appendChild(document.createElement('br'));
    temp.appendChild(document.createElement('br'));
    temp.appendChild(document.createElement('br'));
    temp.appendChild(header);
    temp.appendChild(input1);
    var p = document.createElement('p');
    p.innerText = "Please Select a Team"
    temp.appendChild(p)
    temp.appendChild(document.createElement('br'));
    var colors = ["red","blue","green","orange", "white"]
    for (var i = 4; i >= 0; i--) {
      var color = document.createElement('div')
      color.className = "team";
      color.style.backgroundColor = colors[i];

      color.addEventListener('click', function(){
        this.setVisible("play")
        // this.switchPlay();
      }.bind(this))

      temp.appendChild(color);
      temp.style.display = 'block'
    }
  },

  popFound: function(){
    var temp = document.getElementById('temp');
    temp.style.display= 'block';
    temp.innerHTML = "<h1>Well Done!<br>" + this.game.currentObj.clue + "<br>You found it <br>" + this.game.currentObj.foundMessage + "</h1>";
    setTimeout(function(){
      temp.style.display= 'none'
    },2500)
  },

  endGame:function(){
    var temp = document.getElementById('temp');
    temp.innerHTML = "<h1>GAME OVER</h1>"
    temp.style.display = 'block';

  },

  // switchCreate: function(){
  //   var create = document.getElementById('createArea');
  //   var play = document.getElementById('playArea');
  //   if (create.style.display === 'none'){
  //     create.style.display = 'block';
  //     play.style.display = 'none';}
  //   },

  //   switchPlay: function(){
  //     var create = document.getElementById('createArea');
  //     var play = document.getElementById('playArea');
  //     if (play.style.display === 'none'){
  //       create.style.display = 'none';
  //       play.style.display = 'block';}
  //     },

      populateCreate: function(event){
        this.setVisible("create")
       var create = document.getElementById('createArea');
       create.innerHTML = "<h1>Create</h1>"   
       var button2 = document.createElement('button');
       button2.innerText = "Game Complete!"
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
       input6.type = "range";
       input6.min = 50;
       input6.max = 500000;
       input6.name = "setTolerance";
       input6.value = state.tolerance;
       input6.addEventListener('change', function(event){
         state.tolerance = Number(event.target.value)
         this.game.map.circles[this.game.map.circles.length-1].setVisible(false)
         this.game.map.circles.pop()
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
       form.appendChild(document.createElement('br'))
       form.appendChild(button);
       create.appendChild(form);
       create.appendChild(button2)  

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
       var play = document.getElementById('playArea');
       play.innerHTML = "<h1>Play</h1><br>Here is your first clue: <br>" + this.game.currentObj.clue + "<br>"
       var button = document.createElement('button');
       button.innerHTML = "Get a Hint"
       play.appendChild(button);
       button.addEventListener('click', function(event){
         var hint = this.game.currentObj.giveHint(state.latLng, state.currTeam )
         console.log(hint)
       }.bind(this))
     }
   }
   module.exports = View;