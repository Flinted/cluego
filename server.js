var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var ObjectID = mongodb.ObjectID;
var path = require('path');
var CircularJSON = require ('circular-json');


app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('client/build'));

var url = 'mongodb://localhost:27017/cluego';

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
})


// Retrieve one game object from mongodb.
app.get('/games/:id', function(req, res) {
  MongoClient.connect( url, function( err, db ) {
    var collection = db.collection( 'games' );
    var game = collection.findOne( { _id: new ObjectID(req.params.id) }, function(err, game){
      res.json(game);
      db.close();
    });

  })
})

  // Index of all saved game objects.
  app.get('/games', function(req, res) {
    MongoClient.connect( url, function( err, db ) {
      var collection = db.collection( 'games' );
      collection.find({},{_id:1}).toArray( function( err, docs ) {
        res.json( docs );
        db.close();
      })
    })
  })


  // Save one new game object to mongodb.
  app.post('/games', function(req, res) {
    MongoClient.connect( url, function( err, db ) {
     var collection = db.collection( 'games' );
     console.log(req.body)
     collection.insert( req.body )
     res.status(200).end();
     db.close();
   })
  });

  // Delete one game object from mongodb.
  app.delete('/games/:id', function(req, res) {
    MongoClient.connect( url, function(err, db) {
     var collection = db.collection( 'games' );
     collection.remove( { _id: new ObjectID(req.params.id) } );
     res.status(200).end();
     db.close();
   })
  });


  app.listen('3000', function(){
    console.log("run run running on 3000");
  })
