var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var ObjectID = mongodb.ObjectID;
var path = require('path');

app.use(bodyParser.json());
app.use(express.static('client/build'));
var url = 'mongodb://localhost:27017/cluego';
 
app.get("/", function(req,res){
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
    })

app.post('/games', function(req,res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('games');
    collection.insert(req.body);
    res.status(200).end();
    db.close();
  })
})

  app.get("/games/:id", function(req,res){
      MongoClient.connect(url, function(err, db){
        var collection = db.collection('games');
        collection.find({_id: new ObjectID(req.params.id)},{_id: 0}).toArray(function(err, docs){
          res.json(docs);
          db.close();
        })
      })
})

app.listen('3000', function(){
  console.log("run run running on 3000");
})