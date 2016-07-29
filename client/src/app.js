var Game = require('./game/game.js');

var state = {
  view: '',
  game: '',
  games:[]
}
window.onload= function(){
  state.game = new Game();
  state.game.map.bindClick();
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
