/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var View = __webpack_require__(4);
	
	var state = {
	  view: '',
	  game: '',
	  games:[]
	}
	window.onload= function(){
	  state.game = new Game();
	  state.view = new View(state.game);
	  state.game.addTeam("testTeam")
	  state.view.initialise();
	  state.game.map.initialise()
	  // state.game.map.addInfoWindow({lat:51.4700,lng:-0.4543}, "hello")
	  // state.game.map.addInfoWindow({lat:51.7700,lng:-0.4543})
	  // state.game.map.addInfoWindow({lat:31.7700,lng:-0.3543})
	  // state.game.map.addInfoWindow({lat:51.7700,lng:-23.4543})
	  // state.game.map.addInfoWindow({lat:75.7700,lng:-15.4543})
	  // state.game.map.addPath();
	  // state.game.map.drawCircle({lat:51.4700,lng:-0.4543}, 80)
	  // state.game.createObjective({
	  //     clue: "Clue1",
	  //     hints: ['hint1', 'hint2', 'hint3'],
	  //     latLng: {lat: 51.4700, lng: -0.4543},
	  //     tolerance: 50,
	  //     foundMessage: "Well Done"
	  //   })
	  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
	  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
	  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
	  // state.game.currentObj.giveHint({lat: -89.0700, lng: -120.4}, state.game.teams[0] )  
	  // state.game.ajax.go("GET", "/games")
	  // state.game.ajax.response
	
	}
	
	var main = function(){
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ajax = __webpack_require__(2);
	var Map = __webpack_require__(3);
	var View = __webpack_require__(4);
	var Team = __webpack_require__(5);
	var Objective = __webpack_require__(6)
	
	
	var Game = function(){
	  this.ajax = new Ajax();
	  this.map = new Map({lat:51.4700,lng:-0.4543}, 10);
	  this.objectives = [];
	  this.teams = [];
	  this.currentObj = 0;
	  this.state = "create";
	}
	
	Game.prototype = {
	    // creates a new objective using form input
	    createObjective: function(input){
	      var objective = new Objective(input, this.map.googleMap);
	      this.objectives.push(objective);
	      if(this.currentObj === 0){this.currentObj = objective};
	    },
	
	    // new up a team and add it to the teams array
	    addTeam: function(name){
	      var team = new Team(name);
	      this.teams.push(team);
	    },
	
	    updateCurrent: function(){
	      if(this.currentObj === this.objectives[this.objectives.length-1]){return true}
	
	        for (var i = this.objectives.length - 1; i >= 0; i--) {
	          if(this.objectives[i] === this.currentObj){
	            this.currentObj = this.objectives[i+1];
	            break
	          }
	        }
	    },
	
	    changeToPlay: function(){
	      this.state = "play";
	    },
	
	    changeToCreate: function(){
	      this.state = "create";
	    }
	
	
	  }
	
	  module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var Ajax = function(){
	  this.response = ''
	}
	
	Ajax.prototype = {
	  go: function(type, route){
	    var request = new XMLHttpRequest();
	    request.open(type,route);
	    request.setRequestHeader('Content-Type', 'application/json');
	    request.onload = function(){
	      if (request.status === 200){
	      var jsonString = request.responseText;
	      this.response = JSON.parse(jsonString);
	    }
	    }.bind(this)
	    request.send(null);
	  }
	
	}
	module.exports = Ajax;

/***/ },
/* 3 */
/***/ function(module, exports) {

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
	    minZoom: 2,
	    mapTypeControl: false,
	    zoomControlOptions: {
	      position: google.maps.ControlPosition.RIGHT_CENTER 
	    }
	  });
	
	  this.infoWindow = new google.maps.InfoWindow({
	    content: ""
	  })
	  this.markers = [];
	  this.circles = [];
	  this.path = '';
	  this.foundMarkers = [];
	  this.foundWindows = [];
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
	
	  addFoundWindow: function(latLng, content){
	    var marker = this.addMarker(latLng);
	    this.foundMarkers.push(marker);
	    marker.addListener('click', function(event){
	      this.infoWindow.close();
	      var infoWindow = new google.maps.InfoWindow({
	        content: content
	      })
	      this.foundWindows.push(infoWindow);
	      infoWindow.open( this.map, marker ); 
	    }.bind(this))
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
	
	    hideMarkers: function(){
	      for(marker of this.markers){
	        marker.setVisible(false);
	      }
	      for(circle of this.circles){
	        circle.setVisible(false);
	      }
	      this.path.setVisible(false);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	      this.game.changeToCreate();
	        this.switchCreate();
	    }.bind(this))
	    var play = document.getElementById('play');
	    play.addEventListener('click',function(){
	      this.game.map.hideMarkers();
	      this.selectTeam();
	      this.populatePlay()
	      this.game.changeToPlay();
	    }.bind(this))
	  },
	  
	  // looks for clicks on map
	  mapBindClick: function(){
	    google.maps.event.addListener( this.game.map.googleMap, 'click', function(event){
	      this.game.map.googleMap.panTo(event.latLng)
	      state.latLng = {lat: event.latLng.lat(), lng: event.latLng.lng()}
	
	      if(this.game.state === "create"){
	        if(this.ran){
	          this.game.map.markers[this.game.map.markers.length-1].setVisible(false)
	          this.game.map.circles[this.game.map.circles.length-1].setVisible(false)
	          this.game.map.markers.pop()
	          this.game.map.circles.pop()
	        }
	        this.ran = true;
	        this.game.map.addInfoWindow(state.latLng);
	        this.game.map.drawCircle(state.latLng, state.tolerance);
	        
	        if (this.readyForNext){
	        this.readyForNext = false;
	        this.populateCreate(event);}
	      }else{
	        if(this.game.currentObj.checkFound(event.latLng)){
	          this.game.map.addFoundWindow(this.game.currentObj.latLng, "FOUND ME!")
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
	  selectTeam: function(){
	    var temp = document.getElementById('temp');
	    var input1 = document.createElement('input');
	    var header = document.createElement('h1');
	    
	    header.innerHTML = "Please enter Player Name"
	    input1.type = "text";
	    input1.name = "name";
	    input1.required = true;
	    input1.placeholder = "Enter Player Name";
	    
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
	      this.switchPlay();
	      }.bind(this))
	
	      temp.appendChild(color);
	    }
	  },
	
	  popFound: function(){
	
	  },
	
	  endGame:function(){
	    var temp = document.getElementById('temp');
	    temp.innerHTML = "<h1 color='white'>GAME OVER</h1>"
	  },
	
	  switchCreate: function(){
	    var create = document.getElementById('createArea');
	    var play = document.getElementById('playArea');
	    if (create.style.display === 'none'){
	    create.style.display = 'block';
	    play.style.display = 'none';}
	    },
	
	  switchPlay: function(){
	    var create = document.getElementById('createArea');
	    var play = document.getElementById('playArea');
	    if (play.style.display === 'none'){
	    create.style.display = 'none';
	    play.style.display = 'block';}
	    },
	
	   populateCreate: function(event){
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
	   }.bind(this))
	  }
	}
	  module.exports = View;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var Team = function(name){
	  this.name = name
	  this.players = [],
	  this.points = [],
	  this.games = []
	  this.penalties = 0
	}
	
	Team.prototype = {
	  totalPoints: function(){
	    var total = 0;
	    this.points.forEach(function(point){
	      total += point.value;
	    })
	    return total - this.penalties;
	  },
	
	  addPoints: function(newPoint){
	    this.points.push(newPoint)
	  },
	
	  addPlayer: function(player){
	    this.players.push(player);
	  },
	
	  removePlayer: function(player){
	    this.players.forEach(function(teamPlayer, index){
	      if(teamPlayer === player){
	        this.players.splice(index,1)
	      };
	    }.bind(this))
	  },
	
	  addPenalty: function(penalty){
	    this.penalties += penalty
	  }, 
	
	  getEndGame: function(){
	
	  }
	
	}
	
	module.exports = Team;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var Objective = function(params, map){
	  this.clue = params.clue;
	  this.hints =  params.hints;
	  this.googleMap= map;
	  this.hintCount = 0;
	  this.latLng = params.latLng;
	  this.tolerance =  params.tolerance;
	  this.found = [];
	  this.foundMessage = params.foundMessage;
	  this.points = 0;
	  this.circle = new google.maps.Circle({
	    map: this.googleMap,
	    center: this.latLng,
	    radius: this.tolerance,
	    visible: false
	  });
	}
	
	Objective.prototype = {
	  // checks if given coords fall within this.
	  checkFound: function(latLng, team){
	    if (google.maps.geometry.spherical.computeDistanceBetween(latLng, this.circle.getCenter()) <= this.circle.getRadius()) {
	      console.log('FOUND!')
	      return true
	    } else {
	      console.log('NOTHING')
	      return false
	    }
	  },
	
	  // returns next hint in the array or a directional hint if all used.  charges penalty for use
	  giveHint: function(latLng, team){
	    team.addPenalty(2);
	    this.hintCount +=1;
	    if(this.hintCount >= this.hints.length){
	      this.directionHint(latLng);
	    }else{
	      return this.hints[this.hintCount-1];
	    }
	  },
	
	  // updates compass with bearing to next clue if not hints left
	  directionHint: function(latLng){
	    var marker1 = new google.maps.Marker({
	      position:  latLng
	    })
	    var marker2 = new google.maps.Marker({
	      position:  this.latLng
	    })
	    var bearing = google.maps.geometry.spherical.computeHeading(marker1.getPosition(),marker2.getPosition());
	    console.log(this.latLng, latLng, bearing)
	    var compassDisc = document.getElementById("arrow");
	    compassDisc.style.webkitTransform = "rotate("+ bearing +"deg)";
	  },
	
	  // adds point with info to the given team
	  addFound: function(team){
	    this.found.push(team);
	    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)}
	    team.addPoints(point);
	  },
	
	  // returns points base on order found for the addFound function
	  givePoints: function(team){
	    this.found.forEach(function(foundTeam, index){
	      if(foundTeam.name === team.name){
	        this.points = 5 - index;
	        if(this.points < 0){ this.points = 0}
	      }
	  }.bind(this))
	    return this.points;
	  }
	}
	
	module.exports = Objective;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map