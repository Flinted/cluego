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
	var View = __webpack_require__(5);
	var CircularJSON = __webpack_require__ (3);
	
	var state = {
	  view: "",
	  game: "",
	  games:[]
	}
	window.onload= function(){
	  state.game = new Game();
	  state.view = new View(state.game);
	  state.game.addTeam("DarkOrange Team")
	  state.game.addTeam("BlueViolet Team")
	  state.game.addTeam("ForestGreen Team")
	  state.game.addTeam("RoyalBlue Team")
	  state.game.addTeam("Gold Team")
	  state.view.initialise();
	  state.game.map.initialise()
	  main();
	}
	
	
	var main = function(){
	  
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ajax = __webpack_require__(2);
	var Map = __webpack_require__(4);
	var View = __webpack_require__(5);
	var Team = __webpack_require__(6);
	var Objective = __webpack_require__(7)
	var CircularJSON = __webpack_require__ (3);
	
	
	var Game = function(){
	  this.ajax = new Ajax();
	  this.map = new Map({lat:55.9486,lng:-3.1888}, 10);
	  this.objectives = [];
	  this.teams = [];
	  this.currentObj = 0;
	  this.state = "create";
	  this.id = 0;
	}
	
	Game.prototype = {
	    // creates a new objective using form input
	    createObjective: function(input){
	      var objective = new Objective(input, this.map.googleMap);
	      objective.hints.filter(function(n){n=>true})
	      this.objectives.push(objective);
	      if(this.currentObj === 0){this.currentObj = objective};
	    },
	
	    setZoom: function(){
	      var north = 0
	      var south = 0
	      var east = 0
	      var west = 0
	
	      this.objectives.forEach(function(objective){
	        var lat = objective.latLng.lat 
	        var lng = objective.latLng.lng 
	        if(!north){north = lat}
	        if(!south){south = lat}
	        if(!east ){east = lng}
	        if(!west ){west = lng}
	        if(lat > north){north = lat}
	        if(lat < south){south = lat}
	        if(lng > east ){east = lng}
	        if(lng < west ){west = lng}
	      })
	      this.map.googleMap.setZoom(2)
	      this.map.googleMap.fitBounds({north: north, south: south, east: east, west: west})  
	    },
	
	    // new up a team and add it to the teams array
	    addTeam: function(name){
	      var team = new Team(name);
	      this.teams.push(team);
	    },
	
	    restart: function(name){
	      this.objectives = [];
	      this.currentObj = 0;
	      this.state = "create";
	      this.map.markers=[];
	      this.map.circles =[];
	      this.map.path = '';
	      this.map.foundMarkers=[];
	      this.map.foundWindows=[];
	
	      this.teams.forEach(function(team){
	        team.logGame()
	      })
	    },
	
	    rankTeams: function(){
	      var ranked = []
	      this.teams.forEach(function(team){
	        console.log(team)
	        var result = {name: team.name, points: team.totalPoints(), score: team.score(), penalties: team.penalties}
	        ranked.push(result)
	      })
	
	        ranked.sort(function(a, b) {
	          var x = b["points"]; 
	          var y = a["points"];
	          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	        });
	      return ranked
	    },
	
	    save: function(gameName){
	      if(this.objectives.length === 0){return}
	      var objectiveStates = {name: gameName, state: []}
	      this.objectives.forEach(function(objective){
	        var state = {clue: objective.clue, hints: objective.hints, latLng: objective.latLng, tolerance: objective.tolerance, foundMessage: objective.foundMessage}
	        objectiveStates.state.push(state)
	      }.bind(this)) 
	      this.ajax.go("POST","/games", CircularJSON.stringify(objectiveStates))
	      // this.id += 1;
	      // return {id: "game"+(this.id-1), clues: this.objectives.length, first: this.currentObj}  
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
/***/ function(module, exports, __webpack_require__) {

	
	var CircularJSON = __webpack_require__ (3);
	
	var Ajax = function(){
	  this.response = ''
	  this.status = ''
	}
	
	Ajax.prototype = {
	  go: function(type, route, data){
	      this.status = ''
	      var request = new XMLHttpRequest();
	      request.open(type,route);
	      request.setRequestHeader('Content-Type', 'application/json');
	      request.onload = function(){
	        if (request.status === 200){
	          if(request.responseText){
	            var jsonString = request.responseText;
	            this.response = JSON.parse(jsonString)
	            this.status =  "done"
	             }
	         }
	     }.bind(this)
	     request.send(data || null);
	  }
	
	}
	module.exports = Ajax;
	
	


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*!
	Copyright (C) 2013 by WebReflection
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	*/
	var
	  // should be a not so common char
	  // possibly one JSON does not encode
	  // possibly one encodeURIComponent does not encode
	  // right now this char is '~' but this might change in the future
	  specialChar = '~',
	  safeSpecialChar = '\\x' + (
	    '0' + specialChar.charCodeAt(0).toString(16)
	  ).slice(-2),
	  escapedSafeSpecialChar = '\\' + safeSpecialChar,
	  specialCharRG = new RegExp(safeSpecialChar, 'g'),
	  safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),
	
	  safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),
	
	  indexOf = [].indexOf || function(v){
	    for(var i=this.length;i--&&this[i]!==v;);
	    return i;
	  },
	  $String = String  // there's no way to drop warnings in JSHint
	                    // about new String ... well, I need that here!
	                    // faked, and happy linter!
	;
	
	function generateReplacer(value, replacer, resolve) {
	  var
	    path = [],
	    all  = [value],
	    seen = [value],
	    mapp = [resolve ? specialChar : '[Circular]'],
	    last = value,
	    lvl  = 1,
	    i
	  ;
	  return function(key, value) {
	    // the replacer has rights to decide
	    // if a new object should be returned
	    // or if there's some key to drop
	    // let's call it here rather than "too late"
	    if (replacer) value = replacer.call(this, key, value);
	
	    // did you know ? Safari passes keys as integers for arrays
	    // which means if (key) when key === 0 won't pass the check
	    if (key !== '') {
	      if (last !== this) {
	        i = lvl - indexOf.call(all, this) - 1;
	        lvl -= i;
	        all.splice(lvl, all.length);
	        path.splice(lvl - 1, path.length);
	        last = this;
	      }
	      // console.log(lvl, key, path);
	      if (typeof value === 'object' && value) {
	    	// if object isn't referring to parent object, add to the
	        // object path stack. Otherwise it is already there.
	        if (indexOf.call(all, value) < 0) {
	          all.push(last = value);
	        }
	        lvl = all.length;
	        i = indexOf.call(seen, value);
	        if (i < 0) {
	          i = seen.push(value) - 1;
	          if (resolve) {
	            // key cannot contain specialChar but could be not a string
	            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
	            mapp[i] = specialChar + path.join(specialChar);
	          } else {
	            mapp[i] = mapp[0];
	          }
	        } else {
	          value = mapp[i];
	        }
	      } else {
	        if (typeof value === 'string' && resolve) {
	          // ensure no special char involved on deserialization
	          // in this case only first char is important
	          // no need to replace all value (better performance)
	          value = value .replace(safeSpecialChar, escapedSafeSpecialChar)
	                        .replace(specialChar, safeSpecialChar);
	        }
	      }
	    }
	    return value;
	  };
	}
	
	function retrieveFromPath(current, keys) {
	  for(var i = 0, length = keys.length; i < length; current = current[
	    // keys should be normalized back here
	    keys[i++].replace(safeSpecialCharRG, specialChar)
	  ]);
	  return current;
	}
	
	function generateReviver(reviver) {
	  return function(key, value) {
	    var isString = typeof value === 'string';
	    if (isString && value.charAt(0) === specialChar) {
	      return new $String(value.slice(1));
	    }
	    if (key === '') value = regenerate(value, value, {});
	    // again, only one needed, do not use the RegExp for this replacement
	    // only keys need the RegExp
	    if (isString) value = value .replace(safeStartWithSpecialCharRG, '$1' + specialChar)
	                                .replace(escapedSafeSpecialChar, safeSpecialChar);
	    return reviver ? reviver.call(this, key, value) : value;
	  };
	}
	
	function regenerateArray(root, current, retrieve) {
	  for (var i = 0, length = current.length; i < length; i++) {
	    current[i] = regenerate(root, current[i], retrieve);
	  }
	  return current;
	}
	
	function regenerateObject(root, current, retrieve) {
	  for (var key in current) {
	    if (current.hasOwnProperty(key)) {
	      current[key] = regenerate(root, current[key], retrieve);
	    }
	  }
	  return current;
	}
	
	function regenerate(root, current, retrieve) {
	  return current instanceof Array ?
	    // fast Array reconstruction
	    regenerateArray(root, current, retrieve) :
	    (
	      current instanceof $String ?
	        (
	          // root is an empty string
	          current.length ?
	            (
	              retrieve.hasOwnProperty(current) ?
	                retrieve[current] :
	                retrieve[current] = retrieveFromPath(
	                  root, current.split(specialChar)
	                )
	            ) :
	            root
	        ) :
	        (
	          current instanceof Object ?
	            // dedicated Object parser
	            regenerateObject(root, current, retrieve) :
	            // value as it is
	            current
	        )
	    )
	  ;
	}
	
	function stringifyRecursion(value, replacer, space, doNotResolve) {
	  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
	}
	
	function parseRecursion(text, reviver) {
	  return JSON.parse(text, generateReviver(reviver));
	}
	this.stringify = stringifyRecursion;
	this.parse = parseRecursion;

/***/ },
/* 4 */
/***/ function(module, exports) {

	  var styles = [
	  {
	    "featureType": "poi",
	    "stylers": [
	      { "visibility": "on" }
	    ]
	  },{
	    "featureType": "road",
	    "stylers": [
	      { "visibility": "on" }
	    ]
	  },{
	    "featureType": "water",
	    "stylers": [
	      { "color": "#71c8d4" }
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
	      { "color": "#a8dba8" }
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
	    clickableIcons: false, 
	    draggableCursor:'crosshair',
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
	        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
	        scale: 5
	      },
	    })
	    return marker;   
	  }, 
	
	  addFoundWindow: function(latLng, content){
	    var marker = this.addMarker(latLng);
	    this.foundMarkers.push(marker);
	    var infoWindow = new google.maps.InfoWindow({
	      content: content
	    })
	    this.foundWindows.push(infoWindow);
	    this.foundWindows[this.foundWindows.length-1].open( this.map, marker ); 
	
	    infoWindow.open( this.map, marker ); 
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
	    if(this.path){this.path.setVisible(false);}
	    
	    },
	
	  // connects all markers in the array
	  addPath: function(){
	    var markerPath = [];
	    this.markers.forEach(function(marker){
	      var latLng = {lat: marker.position.lat(), lng: marker.position.lng()}
	      markerPath.push(latLng);
	    })
	    if(this.path){this.path.setVisible(false);}
	
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
	      strokeColor: '#F16B6F',
	      strokeOpacity: 0.9,
	      strokeWeight: 3,
	      fillColor: '#F16B6F',
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var LineChart = __webpack_require__(8)
	var CircularJSON = __webpack_require__(3)
	var Game = __webpack_require__(1)
	
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
	    go.id = "gameNamez"
	    go.innerText = "enter"
	    go.addEventListener("click",function(){
	      var gameName = document.getElementById('gameName').value;
	      this.initiateSave(gameName)
	      this.setCreateOrPlay();
	    }.bind(this))
	
	    createPlay.appendChild(document.createElement('br'))
	    createPlay.appendChild(name)
	    createPlay.appendChild(document.createElement('br'))
	    createPlay.appendChild(input)
	    createPlay.appendChild(document.createElement('br'))
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
	     }else{ stats.style.top = "485px"}
	   })
	  },
	  
	  goPlay: function(){
	    this.game.map.hideMarkers();
	    this.selectTeam();
	    this.populatePlay()
	    this.game.changeToPlay();
	  },
	
	  goCreate: function(){
	    this.game.restart();
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
	            this.game.map.addFoundWindow(this.game.currentObj.latLng, content);
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
	    
	    header.innerHTML = "<br>Please enter Player Name"
	    input1.id = "nameForm"
	    input1.type = "text";
	    input1.name = "name";
	    input1.required = true;
	    input1.placeholder = "Enter Player Name";
	    temp.innerHTML=''
	    temp.appendChild(header);
	    temp.appendChild(input1);
	    var p = document.createElement('p');
	    p.innerHTML = "<br><br>Please Select a Team"
	    temp.appendChild(p)
	    var colors = ["DarkOrange","BlueViolet","ForestGreen","RoyalBlue", "Gold"]
	    for (var i = 4; i >= 0; i--) {
	      var color = document.createElement('div')
	      color.className = "team";
	      color.style.backgroundColor = colors[i];
	      color.id = colors[i]
	      color.addEventListener('click', function(event){
	        console.log(event.target.id)
	        state.player = input1.value || "Player"
	        this.selectGame(event.target.id)
	      }.bind(this))
	      temp.appendChild(color);
	      temp.style.display = 'block'
	    }
	  },
	
	  selectGame: function(color){
	    this.game.teams.forEach(function(team){
	      if(color === team.name.split(' ')[0]){
	        state.currTeam = team
	      }
	    })
	    var temp = document.getElementById('temp');
	    var header = document.createElement('h1');
	    var scroller = document.createElement('div');
	    var p = document.createElement('p');
	    p.innerHTML = "<br>scroll for more games<br>click to select"
	    scroller.id ="scroll"
	    this.setVisible("temp")
	    console.log(state.currTeam)
	    header.innerHTML = "Hello " + state.player + "<br> you have joined the " + color + " team, <br>Please select a game<br>"
	    temp.innerHTML=''
	    temp.appendChild(header);
	    temp.appendChild(document.createElement('br'))
	    temp.appendChild(scroller);
	    temp.appendChild(document.createElement('br'))
	    temp.appendChild(p);
	    this.populateGames()
	    },
	
	  populateGames: function(){
	    this.games = this.game.ajax.response
	    console.log(this.games)
	    var temp = document.getElementById('scroll');
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
	    var homeButton = document.createElement('button');
	    createButton.innerHTML = "show / hide stats";
	    homeButton.innerHTML = "home";
	    createButton.id = "toggle"
	    homeButton.id = "home"
	    // createButton.id = "create";
	    create.appendChild(homeButton);
	    create.appendChild(createButton);
	    createButton.addEventListener('click',function(){
	      console.log("click")
	      this.prepareChart()
	    }.bind(this));
	    homeButton.addEventListener('click',function(){
	      console.log("click")
	      this.setCreateOrPlay()
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
	    var create = document.getElementById('createArea')
	    create.innerHTML = "<h1>Create</h1>"   
	    var button2 = document.createElement('button');
	    var home = document.createElement('button');
	    home.id ="home"
	    home.innerText ="home"
	    home.addEventListener('click', function(){
	      this.setCreateOrPlay()
	    }.bind(this));
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
	    input6.min = 0;
	    input6.max = 0;
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
	    create.appendChild(home)
	    this.setTolerance();
	
	    var objective = document.getElementById( 'objective' );
	    objective.addEventListener('submit', function(event){
	      event.preventDefault();
	      this.handleSubmit(event);
	    }.bind(this))
	
	  },
	
	  detectZoom: function(){
	     google.maps.event.addListener( this.game.map.googleMap, 'zoom_changed', function(){
	     this.setTolerance();
	   }.bind(this))
	   },
	
	  setTolerance: function(){
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
	       var head = document.createElement('h5')
	       var question = document.createElement('h1')
	       head.innerHTML = "Hey " + state.player + ", here is your clue:"
	       question.innerHTML =  this.game.currentObj.clue
	       var button = document.createElement('button');
	       play.appendChild(button);
	       play.appendChild(head) 
	       play.appendChild(document.createElement("br"))
	       play.appendChild(question)
	
	       button.innerHTML = "Get a Hint"
	       button.addEventListener('click', function(event){
	         this.showHint()
	         this.populatePoints()
	         var stats = document.getElementById('playArea')  
	         if(this.game.currentObj.hintCount === 0){stats.style.top = "660px"}
	         if(this.game.currentObj.hintCount === 1){stats.style.top = "625px"}
	         if(this.game.currentObj.hintCount === 2){stats.style.top = "600px"}
	         if(this.game.currentObj.hintCount === 3){stats.style.top = "560px"}
	       }.bind(this))
	     },
	
	     populatePoints: function(){
	      var home = document.createElement('button');
	      home.id ="playHome"
	      home.innerText ="home"
	      home.addEventListener('click', function(){
	        this.setCreateOrPlay()
	      }.bind(this));
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
	      points.appendChild(document.createElement('br'))
	      this.getOthersPoints()
	      points.appendChild(home);
	    },
	
	    getOthersPoints: function(){
	        var scoreDiv = document.getElementById('scoreDiv')
	        scoreDiv.innerHTML = ""
	
	      this.game.teams.forEach(function(team){
	        if(team != state.currTeam){
	        var scoreInfo = document.createElement('p');
	        scoreInfo.innerHTML= team.name + ": " + team.score() + " points."
	        scoreDiv.appendChild(scoreInfo)
	        };
	      }.bind(this))
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
	    return total 
	  },
	
	  score: function(){
	    return this.totalPoints() - this.penalties;
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
	
	  logGame: function(){
	    this.games.push({score:this.score, points: this.totalPoints, penalties: this.penalties});
	    this.points = [];
	    this.penalties = 0;
	  }
	
	}
	
	module.exports = Team;

/***/ },
/* 7 */
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
	    team.addPenalty(1);
	    this.showPoints(-1)
	    this.hintCount +=1;
	    if(this.hintCount > this.hints.length){
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
	    console.log(this.latLng, latLng, bearing);
	    var compassDisc = document.getElementById("arrow");
	    compassDisc.style.webkitTransform = "rotate("+ bearing +"deg)";
	  },
	
	  // adds point with info to the given team
	  addFound: function(team){
	    this.found.push(team);
	    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)};
	    team.addPoints(point);
	  },
	
	  // returns points base on order found for the addFound function
	  givePoints: function(team){
	    this.found.forEach(function(foundTeam, index){
	      if(foundTeam.name === team.name){
	        this.points = 10 - (index * 2);
	        if(this.points < 0){ this.points = 0};
	      }
	  }.bind(this))
	    this.showPoints(this.points);
	    return this.points;
	  },
	
	  showPoints: function(pointsToShow){
	    var points = document.getElementById('points');
	    console.log(points)
	    points.innerHTML= "<h1>"+ pointsToShow + " points!</h1>";
	    points.style.display = "block";
	    setTimeout(function(){points.style.display = 'none'},2000);
	  }
	}
	
	module.exports = Objective;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var LineChart = function(data,categories){
	
	  var container = document.getElementById("lineChart");
	  
	
	  var chart = new Highcharts.Chart({
	    chart: {
	      type: "spline",
	      renderTo: container,
	      backgroundColor: 'rgba(255, 255, 255, 0.95)'
	    },
	        title: {
	          text: "ClueGo"
	        },
	        yAxis: {
	          title: {
	            text: 'Points'
	          },
	          minorGridLineWidth: 0,
	          gridLineWidth: 0,
	    plotBands: [{ 
	     from: 0.5,
	     to: 2.5,
	     color: 'rgba(68, 170, 213, 0.1)',
	     label: {
	       text: 'no points',
	       style: {
	         color: '#606060'
	       }
	     }
	   },
	   { // Light air
	     from: 3.5,
	     to: 4.5,
	     color: 'rgba(68, 170, 213, 0.1)',
	     label: {
	       text: '4th to find',
	       style: {
	         color: '#606060'
	       }
	     }
	   },
	   { // Light air
	     from: 5.5,
	     to: 6.5,
	     color: 'rgba(68, 170, 213, 0.1)',
	     label: {
	       text: '3rd to find',
	       style: {
	         color: '#606060'
	       }
	     }
	   },
	   { // Light air
	    from: 7.5,
	    to: 8.5,
	    color: 'rgba(68, 170, 213, 0.1)',
	    label: {
	      text: '2nd to find',
	      style: {
	        color: '#606060'
	      }
	    }
	  },
	
	    { // Light air
	     from: 9.5,
	     to: 10.5,
	     color: 'rgba(68, 170, 213, 0.1)',
	     label: {
	       text: '1st to find!',
	       style: {
	         color: '#606060'
	       }
	     }
	   }]
	 },
	 series: data,
	
	 xAxis: {
	  categories: categories
	}
	
	
	})
	
	}
	
	module.exports = LineChart;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map