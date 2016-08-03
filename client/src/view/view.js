var LineChart = require("../lineChart.js")
var CircularJSON = require("circular-json")
var Game = require("../game/game.js")

var state = {
 clue: "",
 hints: [],
 tolerance: 100,
 foundMessage: "",
 latLng: '',
 currTeam: '',
 player: ''
}

var View = function(game){
  this.game = game;
  this.readyForNext = true;
  this.ran = false;
  this.games = [];
  this.gameState ='';
}

View.prototype = {
  initialise: function(){
    this.mapBindClick();
    this.setButtons();
    state.currTeam = this.game.teams[0]
    this.detectZoom();
    this.setCreateOrPlay();
  },

  initiateSave: function(gameName){
    this.game.save(gameName)
  },

  setSaveName: function(){
    var createPlay = document.getElementById('temp');
    createPlay.innerHTML = ""
    var name = document.createElement('h1');
    name.innerHTML= "Please name your game"
    var input = document.createElement('input');
    input.type = "text";
    input.name = "gameName";
    input.id = "gameName"
    input.required = true;
    input.placeholder = "Enter game name";
    var go = document.createElement('button');
    go.id = "gameName"
    go.addEventListener("click",function(){
      var gameName = document.getElementById('gameName').value;
      this.initiateSave(gameName)
      this.setCreateOrPlay();
    }.bind(this))

    createPlay.appendChild(name)
    createPlay.appendChild(input)
    createPlay.appendChild(go)
    this.setVisible('temp')
  },

  setCreateOrPlay: function(){
    this.setVisible("temp")
    var createPlay = document.getElementById('temp');
    createPlay.innerHTML = ""
    var createButton = document.createElement('button');
    createButton.innerHTML = "create a game";
    createButton.id = "create";
    createPlay.appendChild(createButton);
    createButton.addEventListener('click',function(){
      this.goCreate()
    }.bind(this));
    var line = document.createElement('div');
    line.id = "line";
    createPlay.appendChild(line);
    var playButton = document.createElement('button');
    playButton.innerHTML = "ready to play?";
    playButton.id = "play";
    createPlay.appendChild(playButton);
    playButton.addEventListener('click',function(){
      this.goPlay()
    }.bind(this));
  },

  setButtons: function(){
    var slide = document.getElementById('slideButton');
    slide.addEventListener('click', function(){
     var stats = document.getElementById('playArea')
     if (stats.style.top != "660px"){
       stats.style.top = "660px"
     }else{ stats.style.top = "435px"}
   })
  },
  
  goPlay: function(){
    this.game.map.hideMarkers();
    this.selectTeam();
    this.populatePlay()
    this.game.changeToPlay();
  },

  goCreate: function(){
    // this.game = this.game.restart();
    this.game.map.googleMap.minZoom = 2;
    this.game.changeToCreate();
    this.setVisible("create");
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
            this.game.currentObj.addFound(state.currTeam)
            var content = this.generateContent();
            this.game.map.addFoundWindow(this.game.currentObj.latLng, content)
            // this.popFound();
            if(this.game.updateCurrent()){
              this.endGame()
            }else{
              this.populatePlay(event)
            }
          }
        }
      }.bind(this))
  },

  generateContent: function(){
    var content = "<h3>"+ this.game.currentObj.clue + "</h3>" + this.game.currentObj.foundMessage + "<br>"
    this.game.currentObj.found.forEach(function(team){
      var teamInfo = "<br> " + team.name + " Points: " + team.totalPoints()
      content += teamInfo
    }.bind(this))
    return content
  },

  resetMarkers: function(){
    this.game.map.markers[this.game.map.markers.length-1].setVisible(false)
    this.game.map.circles[this.game.map.circles.length-1].setVisible(false)
    this.game.map.markers.pop()
    this.game.map.circles.pop()
  },

  selectTeam: function(){
    this.game.ajax.go("GET", "/games")
    var temp = document.getElementById('temp');
    var input1 = document.createElement('input');
    var header = document.createElement('h1');
    this.setVisible("temp")
    
    header.innerHTML = "Please enter Player Name"
    input1.id = "nameForm"
    input1.type = "text";
    input1.name = "name";
    input1.required = true;
    input1.placeholder = "Enter Player Name";
    temp.innerHTML=''
    temp.appendChild(header);
    temp.appendChild(input1);
    var p = document.createElement('p');
    p.innerText = "Please Select a Team"
    temp.appendChild(p)
    temp.appendChild(document.createElement('br'));
    var colors = ["DarkOrange","BlueViolet","ForestGreen","RoyalBlue", "Gold"]
    for (var i = 4; i >= 0; i--) {
      var color = document.createElement('div')
      color.className = "team";
      color.style.backgroundColor = colors[i];
      color.addEventListener('click', function(){
        state.player = input1.value || "Player"
        this.selectGame(color.style.backgroundColor)
      }.bind(this))
      temp.appendChild(color);
      temp.style.display = 'block'
    }
  },

  selectGame: function(color){
    var temp = document.getElementById('temp');
    var header = document.createElement('h1');
    this.setVisible("temp")
    console.log(state.currTeam)
    header.innerHTML = "Hello " + state.player + "<br> you have joined the " + color + " team, Please select a game"
    temp.innerHTML=''
    temp.appendChild(header);
    this.populateGames()
    },

  populateGames: function(){
    this.games = this.game.ajax.response
    console.log(this.games)
    var temp = document.getElementById('temp');
    for (var i = 0; i <= this.games.length-1; i++) {     
      var game = document.createElement('div')
      game.className = "game";
      game.innerHTML = "<h3>"+ this.games[i].name + " - "+ this.games[i].state.length + " clues</h3><p>The First Clue: " + this.games[i].state[0].clue + "</p>";
      game.id = this.games[i]._id;
      game.addEventListener('click', function(event){
       this.reinstateGame(event.target.id)
      }.bind(this))
      temp.appendChild(game);
      }
  },

  reinstateGame: function(index){
    this.game.objectives = [];
    this.game.currentObj = 0;
    // var promise = new Promise(function(resolve, reject){
      this.game.ajax.go("GET", "/games/"+ index)

    //   console.log("running")
    //   if(this.game.ajax.status === "done"){
    //   resolve()
    // }
    // }.bind(this));  

    // promise.then(function(resolve){
    //   console.log("passed")
      setTimeout(function(){this.generateGame()}.bind(this),300)
    // }.bind(this))
  },

  generateGame: function(){
    this.gameState = this.game.ajax.response
    this.gameState.state.forEach(function(state){
      this.game.createObjective(state)
    }.bind(this))
    this.game.setZoom();
    var play = document.getElementById('playArea');
    play.style.top = "660px"
    this.populatePlay()
    this.setVisible("play")
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
    var create = document.getElementById('createArea');
    create.innerHTML = "";
    var h1 = document.createElement('h1')
    h1.id = "endGameMessage"
    h1.innerHTML = "Congratulations!"
    create.appendChild(h1)
    this.setVisible("create")
    var results = this.game.rankTeams()
    var count = 0
    // this.prepareChart();
    results.forEach(function(team){
      var result = document.createElement('p')
      result.id = "endGameResults"
      result.innerHTML ="The " + team.name + " have " + team.points + " points.<br> They incurred " + team.penalties + " penalty points. <br> Giving them a score of " + team.score
      if(count === 0){result.id = "first"}
      count = 1
      create.appendChild(result) 
    })
    var createButton = document.createElement('button');
    createButton.innerHTML = "show / hide stats";
    // createButton.id = "create";
    create.appendChild(createButton);
    createButton.addEventListener('click',function(){
      console.log("click")
      this.prepareChart()
    }.bind(this));
  },

  prepareChart: function(){
    var container = document.getElementById("lineChart");
    if(container.style.display === "block"){
      container.style.display = "none"
    }else{container.style.display = "block"}
    
    var data = []
    this.game.teams.forEach(function(team){
      var dataPoint = [];
      team.points.forEach(function(point){
        dataPoint.push(point.value)
      })
    var chartPoint = {name: team.name, color: team.name.split(" ")[0], data: dataPoint}
    data.push(chartPoint)
    })

    var categories = []
    this.game.objectives.forEach(function(objective){
      categories.push(objective.clue)

    new LineChart(data,categories)
    })
  },

  populateCreate: function(event){
    this.setVisible("create")
    var create = document.getElementById('createArea');
    create.innerHTML = "<h1>Create</h1>"   
    var button2 = document.createElement('button');
    button2.innerText = "Game Complete!"
    button2.addEventListener('click', function(){
      this.setSaveName()
      // this.initiateSave()
      // this.setCreateOrPlay();
    }.bind(this))
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
    input5.placeholder = "Message for player when found";
    var input6 = document.createElement('input');
    input6.type = "range";
    input6.min = 1250;
    input6.max = 28000;
    input6.name = "setTolerance";
    input6.id = "tolerance";
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
    button.id = "enter";
    var tolerText  = document.createElement('p');
    tolerText.id = "tolerText"
    tolerText.innerText = "Slide to set acceptable found area"
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(input4);
    form.appendChild(input5);
    form.appendChild(tolerText);
    form.appendChild(input6);
    form.appendChild(document.createElement('br'))
    form.appendChild(button);
    create.appendChild(form);
    create.appendChild(button2)  

    var objective = document.getElementById( 'objective' );
    objective.addEventListener('submit', function(event){
      event.preventDefault();
      this.handleSubmit(event);
    }.bind(this))

  },

  detectZoom: function(){
     google.maps.event.addListener( this.game.map.googleMap, 'zoom_changed', function(){
     var tolerance = document.getElementById('tolerance');
      if(tolerance){
       var min = 0
       var max = 0
       switch (this.game.map.googleMap.getZoom()){
       case 1:
       case 2:
       case 3:
       min = 300000
       max = 2500000
       break;
       case 4:
       min = 80000
       max = 1500000
       break;
       case 5:
       min = 40000
       max = 700000
       break;
       case 6:
       min = 20000
       max = 400000
       break;
       case 7:
       min = 7500
       max = 190000
       break;
       case 8:
       min = 6000
       max = 100000
       break;
       case 9:
       min = 2000
       max = 50000
       break;
       case 10:
       min = 1250
       max = 28000
       break;
       case 11:
       min = 600
       max = 15000
       break;
       case 12:
       min = 300
       max = 8000
       break;
       case 13:
       min = 150
       max = 4000
       break;
       case 14:
       min = 70
       max = 1900
       break;
       case 15:
       min = 30
       max = 1000
       break;
       case 16:
       min = 15
       max = 500
       break;
       case 17:
       min = 10
       max = 230
       break;
       case 18:
       min = 5
       max = 130
       break;
       case 19:
       min = 2
       max = 60
       break;
       case 20:
       min = 1
       max = 25
       break;
       default:
       break; 
     }
     tolerance.min = min
     tolerance.max = max
     }
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
   this.populateCreate();
   this.ran = false
 },

 populatePlay: function(){
      this.populatePoints()
      var play = document.getElementById('textField');
      play.innerHTML="";
       var head = document.createElement('h1')
       var question = document.createElement('h1')
       head.innerHTML = "Hey " + state.player + ", here is your clue: "+ "<br>" +  this.game.currentObj.clue 
       play.appendChild(head) 
       var button = document.createElement('button');
       button.innerHTML = "Get a Hint"
       play.appendChild(button);
       button.addEventListener('click', function(event){
         this.showHint()
         this.populatePoints()
       }.bind(this))
     },

     populatePoints: function(){
      var points = document.getElementById('pointsArea');
      var score = document.createElement('h3');
      var pointInfo = document.createElement('p');
      var penaltyInfo = document.createElement('p');
      points.innerHTML = "";
      score.innerText = "Score: " + state.currTeam.score();
      pointInfo.innerText ="Points: " + state.currTeam.totalPoints();
      penaltyInfo.innerText = "Penalties: " + state.currTeam.penalties;
      points.appendChild(score);
      points.appendChild(pointInfo);
      points.appendChild(penaltyInfo);
    },

    showHint: function(){
      var hint = this.game.currentObj.giveHint(state.latLng, state.currTeam )
      if (hint){
        var play = document.getElementById('textField');
        var p = document.createElement('p');
        p.innerText = hint
        play.appendChild(p)
      }
      
    }


  }
  module.exports = View;