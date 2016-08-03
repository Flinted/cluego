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
  state.game.addTeam("Red Team")
  state.game.addTeam("Blue Team")
  state.game.addTeam("Green Team")
  state.view.initialise();
  state.game.map.initialise()
  state.game.createObjective({
    clue: "This is where a king might live?",
    hints: ["You will hear from it at 1pm", "You can see it from all around Edinburgh", "at the top of the Royal Mile!"],
    latLng: {lat: 55.9486, lng: -3.1999},
    tolerance: 5000,
    foundMessage: "Well Done, it was Edinburgh Castle"
  })
  state.game.createObjective({
    clue: "This is where a king might rest?",
    hints: ["It's near a very old pub...", "Not far from Duddingston", "Take a seat"],
    latLng: {lat: 55.9441, lng: -3.1618},
    tolerance: 5000,
    foundMessage: "Well Done, it was Arthurs Seat"
  })
  state.game.createObjective({

    clue: "Go Forth!",
    hints: ["Over the water", "Choo Choo", "Big Red"],
    latLng: {lat: 56.0006, lng: -3.3884},
    tolerance: 5000,
    foundMessage: "Well Done, it was the Forth Rail Bridge"
  })
  main();
}


var main = function(){
  state.game.objectives[0].addFound(state.game.teams[1])
  state.game.objectives[0].addFound(state.game.teams[2])
  state.game.objectives[1].addFound(state.game.teams[1])
  state.game.objectives[2].addFound(state.game.teams[1])  
}