var Game = require('./game/game.js');
var View = require('./view/view.js');
var CircularJSON = require ('circular-json');

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