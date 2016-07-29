var Ajax = require('../ajax/ajax.js');
var Map = require('../map/map.js');
var View = require('../view/view.js')

var Game = function(){
  this.ajax = new Ajax();
  this.map = new Map({lat:51.4700,lng:-0.4543}, 6);
  this.objectives = [];
  this.teams = [];
  this.currentObj = '';
  this.state = "create"
}

Game.prototype = {
  createObjective: function(input){
    // creates a new objective using form input
  },

  addTeam: function(){
    // new up a team and add it to teams array
  },

  updateCurrent: function(){
    // changes currentObj to next objective in array
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