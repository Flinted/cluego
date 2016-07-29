var Objective = function(params){
  this.clue = params.clue;
  this.hints =  params.hints;
  this.hintCount = 0;
  this.latLng = params.latLng;
  this.tolerance =  params.tolerance;
  this.found = params.found;

}

Objective.prototype = {
  checkFound: function(latLng, team){


  },

  giveHint: function(latLng){
    if(this.hintCount > this.hints.length){
      this.directionHint(latLng);
    }else{
      this.hintcount +=1;
      return this.hints[this.hintCount-1];
    }

  },

  directionHint: function(latLng){

  },

  givePoints: function(team){
    this.found.forEach(function(foundTeam, index){
      if(foundTeam.name === team.name){
        var points = 5 - index
        if(points < 0){ points = 0}
      }
    })

    team.addPoints(points)
  }


}