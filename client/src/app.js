var Map = require('./map/map.js');

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
