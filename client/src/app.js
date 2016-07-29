var Game = require('./game/game.js');
var View = require('./view/view.js');

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