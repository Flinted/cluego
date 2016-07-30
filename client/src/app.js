var Game = require('./game/game.js');
var View = require('./view/view.js');
var Objective = require('./objective/objective.js')

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