var assert = require('chai').assert;
var Team = require('../../team/team.js');
var Objective = require('../objective.js');

describe("Objective", function(){

  beforeEach(function(){
    redteam = new Team("Red")
    objective = new Objective({
      clue: "Clue1",
      hints: ['hint1', 'hint2', 'hint3'],
      latLng: {lat: 5, lng: 5},
      tolerance: 5,
      foundMessage: "Well Done"
    })
  })

  it("Should create objective", function(){
    assert.deepEqual("Clue1", objective.clue)
  })
  

  
  it("Should add to found and give points", function(){
    objective.addFound(redteam)
    assert.deepEqual(redteam, objective.found[0])
    assert.deepEqual(5, redteam.totalPoints())
  })
  

})
