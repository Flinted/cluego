var assert = require('chai').assert;
var Team = require('../../team/team.js');
var Objective = require('../objectiveToTest.js');

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
    assert.deepEqual(objective.clue, "Clue1")
  })
  
  it("Should add to found and give points", function(){
    objective.addFound(redteam)
    assert.deepEqual(redteam, objective.found[0])
    assert.deepEqual(redteam.totalPoints(), 10)
  })

  it("Should give hints", function(){
    objective.giveHint("latLng", redteam)
    assert.deepEqual(objective.hintCount, 1)
    assert.deepEqual(redteam.penalties, 1)
  })
  
  // it("should switch to directional hints when all used", function(){
  //   assert.deepEqual(objective.giveHint("latLng", redteam),'hint1')
  //   assert.deepEqual(objective.giveHint("latLng", redteam),'hint2')
  //   assert.deepEqual(objective.giveHint("latLng", redteam),'hint3')
  //   assert.equal(objective.giveHint("latLng", redteam), undefined)
  // })

})
