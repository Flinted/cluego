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

	var Game = __webpack_require__(2);
	var View = __webpack_require__(4);
	
	var state = {
	  view: '',
	  game: '',
	  games:[]
	}
	window.onload= function(){
	  state.game = new Game();
	  state.view = new View(state.game);
	  state.view.initialise();
	  // state.game.ajax.go("GET", "/test")
	  // console.log(state.game.ajax.response)
	}
	
	var main = function(){
	  
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Ajax = __webpack_require__(3);
	var Map = __webpack_require__(1);
	var View = __webpack_require__(4)
	
	var Game = function(){
	  this.ajax = new Ajax();
	  this.map = new Map({lat:51.4700,lng:-0.4543}, 6);
	  this.objectives = [];
	  this.teams = [];
	  this.currentObj = '';
	  this.state = "create"
	}
	
	Game.prototype = {
	  createObjective: function(input){
	    // creates a new objective using form input
	  },
	
	  addTeam: function(){
	    // new up a team and add it to teams array
	  },
	
	  updateCurrent: function(){
	    // changes currentObj to next objective in array
	  },
	
	  changeState: function(){
	    if(this.state === "create"){
	      this.state = "play";
	    }else{
	      this.state = "create";
	    }
	  },
	
	
	}
	
	module.exports = Game;

/***/ },
/* 3 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map