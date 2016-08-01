var Ajax = require('../ajax/ajax.js');
var Map = require('../map/map.js');
var View = require('../view/view.js');
var Team = require('../team/team.js');
var Objective = require('../objective/objective.js')


var Game = function(){
  this.ajax = new Ajax();
  this.map = new Map({lat:51.4700,lng:-0.4543}, 10);
  this.objectives = [];
  this.teams = [];
  this.currentObj = 0;
  this.state = "create";
}

Game.prototype = {
    // creates a new objective using form input
    createObjective: function(input){
      var objective = new Objective(input, this.map.googleMap);
      this.objectives.push(objective);
      if(this.currentObj === 0){this.currentObj = objective};
    },

    // new up a team and add it to the teams array
    addTeam: function(name){
      var team = new Team(name);
      this.teams.push(team);
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