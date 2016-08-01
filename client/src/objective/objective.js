var Objective = function(params, map){
  this.clue = params.clue;
  this.hints =  params.hints;
  this.googleMap= map;
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
      console.log('FOUND!')
      return true
    } else {
      console.log('NOTHING')
      return false
    }
  },

  // returns next hint in the array or a directional hint if all used.  charges penalty for use
  giveHint: function(latLng, team){
    team.addPenalty(2);
    this.hintCount +=1;
    if(this.hintCount > this.hints.length){
      this.directionHint(latLng);
    }else{
      return this.hints[this.hintCount-1];
    }
  },

  // updates compass with bearing to next clue if not hints left
  directionHint: function(latLng){
    var marker1 = new google.maps.Marker({
      position:  latLng
    })
    var marker2 = new google.maps.Marker({
      position:  this.latLng
    })
    var bearing = google.maps.geometry.spherical.computeHeading(marker1.getPosition(),marker2.getPosition());
    console.log(this.latLng, latLng, bearing)
    var compassDisc = document.getElementById("arrow");
    compassDisc.style.webkitTransform = "rotate("+ bearing +"deg)";
  },

  // adds point with info to the given team
  addFound: function(team){
    this.found.push(team);
    var point = {clue: this.clue, latLng: this.latLng, value: this.givePoints(team)}
    team.addPoints(point);
  },

  // returns points base on order found for the addFound function
  givePoints: function(team){
    this.found.forEach(function(foundTeam, index){
      if(foundTeam.name === team.name){
        this.points = 5 - index;
        if(this.points < 0){ this.points = 0}
      }
  }.bind(this))
    return this.points;
  }
}

module.exports = Objective;