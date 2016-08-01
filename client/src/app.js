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
  state.game.createObjective({
      clue: "This is where a king might live?",
      hints: ["You will hear from it at 1pm", "You can see it from all around Edinburgh", "at the top of the Royal Mile!"],
      latLng: {lat: 55.9486, lng: -3.1999},
      tolerance: 500,
      foundMessage: "Well Done, it was Edinburgh Castle"
    })

  state.game.createObjective({
      clue: "This is where a king might rest?",
      hints: ["It's near a very old pub...", "Not far from Duddingston", "Take a seat"],
      latLng: {lat: 55.9441, lng: -3.1618},
      tolerance: 500,
      foundMessage: "Well Done, it was Arthurs Seat"
    })

  state.game.createObjective({
      clue: "Go Forth!",
      hints: ["Over the water", "Choo Choo", "Big Red"],
      latLng: {lat: 56.0006, lng: -3.3884},
      tolerance: 500,
      foundMessage: "Well Done, it was the Forth Rail Bridge"
    })
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: 51.4700, lng: -0.4543}, state.game.teams[0] )  
  // state.game.currentObj.giveHint({lat: -89.0700, lng: -120.4}, state.game.teams[0] )  
  // state.game.ajax.go("GET", "/games")
  // state.game.ajax.response

}

var main = function(){
}