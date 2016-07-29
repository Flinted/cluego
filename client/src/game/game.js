var Ajax = require('../ajax/ajax.js');
var Map = require('../map/map.js');
var View = require('../view/view.js')

var Game = function(){
  this.ajax = new Ajax();
  this.map = new Map({lat:51.4700,lng:-0.4543}, 6);
  this.objectives = [];
  this.teams = [];
  this.currentObj = '';
  this.view = new View();
  this.state = "create";
}

module.exports = Game;