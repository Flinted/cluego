var Team = function(name){
  this.name = name
  this.players = [],
  this.points = [],
  this.games = []
  this.penalties = 0
}

Team.prototype = {
  totalPoints: function(){
    var total = 0;
    this.points.forEach(function(point){
      total += point.value;
    })
    return total 
  },

  score: function(){
    return this.totalPoints() - this.penalties;
  },

  addPoints: function(newPoint){
    this.points.push(newPoint)
  },

  addPlayer: function(player){
    this.players.push(player);
  },

  removePlayer: function(player){
    this.players.forEach(function(teamPlayer, index){
      if(teamPlayer === player){
        this.players.splice(index,1)
      };
    }.bind(this))
  },

  addPenalty: function(penalty){
    this.penalties += penalty
  }, 

  getEndGame: function(){

  }

}

module.exports = Team;