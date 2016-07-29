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
  state.game.map.addInfoWindow({lat:51.4700,lng:-0.4543})
  state.game.map.addRectangle({lat:51.4700,lng:-0.4543}, 80)
}

var main = function(){
  
}