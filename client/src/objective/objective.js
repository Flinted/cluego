var Objective = function(params){
  this.clue = params.clue;
  this.hints =  params.hints;
  this.hintCount = 0;
  this.latLng = params.latLng;
  this.tolerance =  params.tolerance;
  this.found = [];
  this.foundMessage = params.foundMessage;
  this.points = 0;

}

Objective.prototype = {
  checkFound: function(latLng, team){

  },

  giveHint: function(latLng, team){
    team.addPenalty(2)
    if(this.hintCount >= this.hints.length){
      this.directionHint(latLng);
    }else{
      this.hintcount +=1;
      return this.hints[this.hintCount-1];
    }
  },

  directionHint: function(latLng){
  },

  addFound: function(team){
    this.found.push(team);
    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)}
    team.addPoints(point)
  },

  givePoints: function(team){
    this.found.forEach(function(foundTeam, index){
      if(foundTeam.name === team.name){
        this.points = 5 - index
        if(this.points < 0){ this.points = 0}
      }
    }.bind(this))
        return this.points
  }

}

module.exports = Objective;