
// 		Requirements
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');

// 		Establish express and port
var app = express();
var port = process.env.PORT || 3000;

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/sheeatsburgers';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('sheeatsburgers');

    /*
    //Create some users
    var user1 = {title: 'test 1', description: 'yo test 1 mic check', author: 'yo dog'};
    var user2 = {title: 'test 2', description: 'biscuits and gravy', author: 'good eattin'};
    var user3 = {title: 'test 3', description: 'happy day', author: 'happy man'};

    // Insert some users
    collection.insert([user1, user2, user3], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
	*/


      //Close connection
      db.close();
    });
  }
});
