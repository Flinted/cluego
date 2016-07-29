var assert = require('chai').assert;
var Team = require('../team.js');

describe("team", function(){

  beforeEach(function(){
    redteam = new Team("Red")
  })


  it('should take given team name', function(){
    assert.deepEqual("Red", redteam.name)
  })

  it('should start with no players', function(){
    assert.deepEqual([], redteam.players)
  })

  it('should be able to add players', function(){
    redteam.addPlayer("Malcolm")
    assert.deepEqual(1, redteam.players.length)
  })

  it('should be able to remove players', function(){
    redteam.addPlayer("Malcolm")
    redteam.removePlayer("Malcolm")
    assert.deepEqual([], redteam.players)
  })

  it('should be able to add points', function(){
    redteam.addPoints({clue: "clue 1", value: 3})
    assert.deepEqual(1, redteam.points.length)
  })

  it('should be able to add penalties', function(){
    redteam.addPenalty(2)
    assert.deepEqual(2, redteam.penalties)
  })

  it('should be take penalties into account', function(){
    redteam.addPoints({clue: "clue 1", value: 3})
    redteam.addPoints({clue: "clue 2", value: 2})
    redteam.addPenalty(2)
    assert.deepEqual(3, redteam.totalPoints())
  })


})