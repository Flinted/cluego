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

	var Map = __webpack_require__(1);
	
	var state = {
	  view: '',
	  game: '',
	  games:[]
	}
	window.onload= function(){
	  map = new Map({lat:51.4700,lng:-0.4543}, 6)
	  map.bindClick();
	}
	
	var main = function(){
	  
	}
	
	
	
	
	// SAMPLE JSON AJAX REQUEST
	// var request = new XMLHttpRequest();
	// request.open("GET","/bucketlist");
	// request.setRequestHeader('Content-Type', 'application/json');
	// request.onload = function(){
	//   if (request.status === 200){
	//     CODE HERE
	//   }
	// }.bind(this)
	// request.send(null);


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
	  // looks for clicks on map
	  this.bindClick = function(){
	    google.maps.event.addListener( this.googleMap, 'click', function(event){
	      console.log('clicked')
	    }.bind(this))
	  };
	}
	
	
	module.exports = Map


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map