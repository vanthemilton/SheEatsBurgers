
// Requires
var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var port = process.env.PORT || 3000;

// Mongo
var mongoHost = '127.0.0.1';
var mongoPort = '27017';
var mongoUser = 'sheeatsburgers';
var mongoPassword = 'sheeatsburgers';
var mongoDBName = 'sheeatsburgers';
var mongoURL = 'mongodb://localhost:27017/sheeatsburgers'
   //'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

// Set up App
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
}))
app.set('view engine', 'handlebars');
// Parse all request bodies as JSON.

app.use(bodyParser.json());
// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));


// Connect DB
var userONE;

MongoClient.connect(mongoURL, function(err, db) {
   if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
   } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', mongoURL);
      // Get the documents collection
      var collection = db.collection('sheeatsburgers');
      collection.find().toArray(function(err, result) {
         userONE = result;
         console.log('first item: ', result[0]);
      });
      //     //Create some users
      console.log("HERE ARE THE FIND " + userONE);
   }
   //db.close();
});

//submit stuff
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
   extended: true
}));
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
// assuming POST: name=foo&color=red            <-- URL encoding
//
// or       POST: {"name":"foo","color":"red"}  <-- JSON encoding

app.post('/submit', function(req, res, next) {
  
   /////////////////////////////////////////////////////////////////////
   //console.log(req.body.description, req.body.title, req.body.BBun);
   if (req.body && req.body.title && req.body.body) {
      //console.log("=== req.body.description == ", req.body.description);
      //console.log("=== req.body.user == ", req.body.user);
      //   var user3 = {title: 'test 3', description: 'happy day', author: 'happy man'};
      MongoClient.connect(mongoURL, function(err, db) {
         if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
         } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', mongoURL);
            // Get the documents collection
            var collection = db.collection('sheeatsburgers');
            console.log("req.body= ", req.body);
            collection.insert([req.body], function(err, result) {
               if (err) {
                  console.log(err);
               } else {
                  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
               }
               collection.find().toArray(function(err, result) {
                  if (err) {
                     throw err;
                  }
                  userONE = result;
               });
               //Close connection
               console.log("db wat" + collection.find({
                  title: "test 1"
               }));
               db.close();
            });
            console.log("HERE ARE THE FIND");
         }
      });
      res.redirect('/');
   }
});

app.get('/', function(req, res) {
   res.render('index-page', {
      db: userONE
   });
});
// If we didn't find the requested resource, send a 404 error.
app.get('*', function(req, res) {
   res.status(404).render('404-page', {
      pageTitle: '404'
   });
});
MongoClient.connect(mongoURL, function(err, db) {
   if (err) {
      console.log("== Unable to make connection to MongoDB Database.")
      throw err;
   }
   mongoDB = db;
   app.listen(port, function() {
      console.log("== Listening on port", port);
   });
});
