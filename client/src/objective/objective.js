var Objective = function(params, map){
  this.clue = params.clue;
  this.hints =  params.hints;
  this.googleMap= map
  this.hintCount = 0;
  this.latLng = params.latLng;
  this.tolerance =  params.tolerance;
  this.found = [];
  this.foundMessage = params.foundMessage;
  this.points = 0;
  this.circle = new google.maps.Circle({
    map: this.googleMap,
    center: this.latLng,
    radius: this.tolerance,
    visible: false
  });
}

Objective.prototype = {
  // checks if given coords fall within this.
  checkFound: function(latLng, team){
    if (google.maps.geometry.spherical.computeDistanceBetween(latLng, this.circle.getCenter()) <= this.circle.getRadius()) {
        console.log('FOUND!');
    } else {
        console.log('NOTHING HERE!');
    }
  },

  // returns next hint in the array or a directional hint if all used.  charges penalty for use
  giveHint: function(latLng, team){
    team.addPenalty(2)
    this.hintCount +=1;
    console.log(latLng)
    if(this.hintCount > this.hints.length){
      this.directionHint(latLng);
    }else{
      return this.hints[this.hintCount-1];
    }
  },

  directionHint: function(latLng){
    console.log(latLng, this.latLng)
    // console.log(google.maps.geometry.spherical.interpolate(latLng,this.latLng))
    // should give an arrow directional hint that then dissapears
  },

  // adds point with info to the given team
  addFound: function(team){
    this.found.push(team);
    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)}
    team.addPoints(point)
  },

  // returns points base on order found for the addFound function
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