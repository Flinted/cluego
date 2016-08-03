var Ajax = require('../ajax/ajax.js');
var Map = require('../map/map.js');
var View = require('../view/view.js');
var Team = require('../team/team.js');
var Objective = require('../objective/objective.js')
var CircularJSON = require ('circular-json');


var Game = function(){
  this.ajax = new Ajax();
  this.map = new Map({lat:55.9486,lng:-3.1888}, 10);
  this.objectives = [];
  this.teams = [];
  this.currentObj = 0;
  this.state = "create";
  this.id = 0;
}

Game.prototype = {
    // creates a new objective using form input
    createObjective: function(input){
      var objective = new Objective(input, this.map.googleMap);
      objective.hints.filter(function(n){n=>true})
      this.objectives.push(objective);
      if(this.currentObj === 0){this.currentObj = objective};
    },

    // new up a team and add it to the teams array
    addTeam: function(name){
      var team = new Team(name);
      this.teams.push(team);
    },

    rankTeams: function(){
      var ranked = []
      this.teams.forEach(function(team){
        console.log(team)
        var result = {name: team.name, points: team.totalPoints(), score: team.score(), penalties: team.penalties}
        ranked.push(result)
      })

        ranked.sort(function(a, b) {
          var x = b["points"]; 
          var y = a["points"];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      return ranked
    },

    save: function(gameName){
      var objectiveStates = {name: gameName, state: []}
      this.objectives.forEach(function(objective){
        var state = {clue: objective.clue, hints: objective.hints, latLng: objective.latLng, tolerance: objective.tolerance, foundMessage: objective.foundMessage}
        objectiveStates.state.push(state)
      }.bind(this)) 
      this.ajax.go("POST","/games", CircularJSON.stringify(objectiveStates))
      // this.id += 1;
      // return {id: "game"+(this.id-1), clues: this.objectives.length, first: this.currentObj}  
    },


    updateCurrent: function(){
      if(this.currentObj === this.objectives[this.objectives.length-1]){return true}

        for (var i = this.objectives.length - 1; i >= 0; i--) {
          if(this.objectives[i] === this.currentObj){
            this.currentObj = this.objectives[i+1];
            break
          }
        }
    },

    changeToPlay: function(){
      this.state = "play";
    },

    changeToCreate: function(){
      this.state = "create";
    }


  }

  module.exports = Game;