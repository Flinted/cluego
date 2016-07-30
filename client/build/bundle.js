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
	var Objective = __webpack_require__(5)
	
	var state = {
	  view: '',
	  game: '',
	  games:[]
	}
	window.onload= function(){
	  state.game = new Game();
	  state.view = new View(state.game);
	  state.view.initialise();
	  state.game.map.addInfoWindow({lat:51.4700,lng:-0.4543})
	  state.game.map.addInfoWindow({lat:51.7700,lng:-0.4543})
	  state.game.map.addInfoWindow({lat:51.4700,lng:-0.4633})
	  state.game.map.addInfoWindow({lat:51.4700,lng:-0.4833})
	  state.game.map.addPath();
	  // state.game.map.addArrow();
	  state.game.map.addCircle({lat:51.4700,lng:-0.4543}, 80)
	  // state.game.objectives.push(new Objective({
	  //     clue: "Clue1",
	  //     hints: ['hint1', 'hint2', 'hint3'],
	  //     latLng: {lat: 51.4700, lng: -0.4543},
	  //     tolerance: 50,
	  //     foundMessage: "Well Done"
	  //   }))
	  // state.game.objectives[0].checkFound({lat: 51.4700, lng: -0.4543})
	  // state.game.objectives[0].checkFound({lat: 51.4000, lng: -0.4043})
	  // state.game.objectives[0].checkFound({lat: 51.4749, lng: -0.4590})
	}
	
	var main = function(){
	  
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ajax = __webpack_require__(2);
	var Map = __webpack_require__(3);
	var View = __webpack_require__(4);
	var Team = __webpack_require__(6);
	
	var Game = function(){
	  this.ajax = new Ajax();
	  this.map = new Map({lat:51.4700,lng:-0.4543}, 10);
	  this.objectives = [];
	  this.teams = [];
	  this.currentObj = this.objectives[0] || 0;
	  this.state = "create"
	}
	
	Game.prototype = {
	    // creates a new objective using form input
	  createObjective: function(input){
	    var objective = new Objective(params);
	    this.objectives.push(objective);
	  },
	
	    // new up a team and add it to the teams array
	  addTeam: function(name){
	    var team = new Team(name);
	    this.teams.push(team);
	  },
	
	  updateCurrent: function(){
	    if(currentObj === this.objectives[this.objectives.length-1]){return "GAME ENDED"}
	
	    this.objectives.forEach(function(objective, index){
	      if(objective === currentObj){
	        currentObj = objectives[index+1]
	        return} 
	    })
	  },
	
	  changeToPlay: function(){
	      this.state = "play";
	  },
	
	  changeToCreate: function(){
	    this.state = "create"
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

	var Map = function(latLng, zoom){
	  this.googleMap = new google.maps.Map(document.getElementById('map'), {
	    center: latLng,
	    zoom: zoom,
	    zoomControlOptions: {
	      position: google.maps.ControlPosition.BOTTOM_CENTER
	    }
	  });
	
	  this.infoWindow = new google.maps.InfoWindow({
	    content: ""
	  })
	
	  this.markers = []
	  this.circles = []
	  this.path = ''
	}
	
	Map.prototype = {
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
	    this.markers.push(marker)
	    marker.addListener('click', function(event){
	      this.infoWindow.close();
	      var infoWindow = new google.maps.InfoWindow({
	        content: content
	      })
	      this.infoWindow = infoWindow;
	      infoWindow.open( this.map, marker ); 
	    }.bind(this))
	  },
	  
	//   addRectangle: function(latLng, tolerance){new google.maps.Rectangle({
	//     strokeColor: 'black',
	//     strokeOpacity: 0.8,
	//     strokeWeight: 2,
	//     fillColor: 'wheat',
	//     fillOpacity: 0.35,
	//     map: this.googleMap,
	//     bounds: {
	//       north: 51.4705,
	//       south: 51.4695,
	//       east: -0.4535,
	//       west: -0.4551
	//     }
	//   });
	// },
	
	  // connects all markers in the array
	  addPath: function(markers){
	    var markerPath = [];
	    this.markers.forEach(function(marker){
	      var latLng = {lat: marker.position.lat(), lng: marker.position.lng()}
	      markerPath.push(latLng)
	    })
	    this.path = new google.maps.Polyline({
	      path: markerPath,
	      geodesic: true,
	      strokeColor: 'black',
	      strokeOpacity: 0.4,
	      strokeWeight: 6
	    });
	    this.path.setMap(this.googleMap)
	  },
	
	
	  addCircle: function(latLng, tolerance){ new google.maps.Circle({
	    strokeColor: 'black',
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: 'wheat',
	    fillOpacity: 0.35,
	    map: this.googleMap,
	    center: latLng,
	    radius: tolerance
	  })
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
	
	
	
	        module.exports = Map


/***/ },
/* 4 */
/***/ function(module, exports) {

	
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	var Objective = function(params){
	  this.clue = params.clue;
	  this.hints =  params.hints;
	  this.hintCount = 0;
	  this.latLng = params.latLng;
	  this.tolerance =  params.tolerance;
	  this.found = [];
	  this.foundMessage = params.foundMessage;
	  this.points = 0;
	  this.circle = params.circle;
	
	  // var latLng = this.marker.getPosition();
	  //    var center = this.circle.getCenter();
	  //    var radius = this.circle.getRadius();
	  //    if (this.circleBounds.contains(latLng) &&
	  //        (google.maps.geometry.spherical.computeDistanceBetween(latLng, center) <= radius)) {
	  //        this.lastMarkerPos = latLng;
	  //        this._geocodePosition(latLng);
	}
	
	Objective.prototype = {
	  // creates a range using the tolerance and checks if given coords fall within this.
	  checkFound: function(latLng, team){
	    var lat = this.latLng.lat
	    var lng = this.latLng.lng
	    if(this.tolerance < 10){var toleranceConvert = "0.000" + this.tolerance}else{ var toleranceConvert = Number("0.0" + this.tolerance/10)}
	    var latRange = {upper: lat + toleranceConvert ,lower: lat - toleranceConvert}
	    var lngRange = {upper: lng + toleranceConvert ,lower: lng - toleranceConvert}
	
	    if(latLng.lat < latRange.upper && latLng.lat > latRange.lower && latLng.lng < lngRange.upper && latLng.lng >lngRange.lower ){
	      console.log("Success!")
	    }else{
	      console.log("Fail!")
	    }
	    // should compare latLng of selection to coordinates latlng
	    // will need to factor in tolerance to see if correct 
	    // if found will need to addFound for the team and give points
	  },
	
	
	  // returns next hint in the array or a directional hint if all used.  charges penalty for use
	  giveHint: function(latLng, team){
	    team.addPenalty(2)
	    this.hintCount +=1;
	
	    if(this.hintCount > this.hints.length){
	      this.directionHint(latLng);
	    }else{
	      return this.hints[this.hintCount-1];
	    }
	  },
	
	  directionHint: function(latLng){
	
	    // should give an arrow directional hint that then dissapears
	  },
	
	  // adds point with info to the given team
	  addFound: function(team){
	    this.found.push(team);
	    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)}
	    team.addPoints(point)
	  },
	
	  // returns points base on order found for the addFound function
	  givePoints: function(team){
	    this.found.forEach(function(foundTeam, index){
	      if(foundTeam.name === team.name){
	        this.points = 5 - index
	        if(this.points < 0){ this.points = 0}
	      }
	    }.bind(this))
	        return this.points
	  }
	}
	
	module.exports = Objective;

/***/ },
/* 6 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map