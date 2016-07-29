var Ajax = require('../ajax/ajax.js');
var Map = require('../map/map.js');
var View = require('../view/view.js')

var Game = function(){
  this.ajax = new Ajax();
  this.map = new Map({lat:51.4700,lng:-0.4543}, 6);
  this.objectives = [];
  this.teams = [];
  this.currentObj = this.objectives[0] || 0;
  this.state = "create"
}

Game.prototype = {
  createObjective: function(input){
    // creates a new objective using form input
  },

  addTeam: function(){
    // new up a team and add it to the teams array
  },

  updateCurrent: function(){
    if(currentObj === this.objectives[this.objectives.length-1]){return "GAME ENDED"}

    this.objectives.forEach(function(objective, index){
      if(objective === currentObj){
        currentObj = objectives[index+1]
        return} 
    })
  },

  changeState: function(){
    if(this.state === "create"){
      this.state = "play";
    }else{
      this.state = "create";
    }
  },


}

module.exports = Game;