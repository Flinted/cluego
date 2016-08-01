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
  state.game.addTeam("testTeam")
  state.view.initialise();
  state.game.map.initialise()
  // state.game.map.addInfoWindow({lat:51.4700,lng:-0.4543}, "hello")
  // state.game.map.addInfoWindow({lat:51.7700,lng:-0.4543})
  // state.game.map.addInfoWindow({lat:31.7700,lng:-0.3543})
  // state.game.map.addInfoWindow({lat:51.7700,lng:-23.4543})
  // state.game.map.addInfoWindow({lat:75.7700,lng:-15.4543})
  // state.game.map.addPath();
  // state.game.map.drawCircle({lat:51.4700,lng:-0.4543}, 80)
  // state.game.createObjective({
  //     clue: "Clue1",
  //     hints: ['hint1', 'hint2', 'hint3'],
  //     latLng: {lat: 51.4700, lng: -0.4543},
  //     tolerance: 50,
  //     foundMessage: "Well Done"
  //   })
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: -89.0700, lng: -120.4}, state.game.teams[0] )  
  // state.game.ajax.go("GET", "/games")
  // state.game.ajax.response

}

var main = function(){
}