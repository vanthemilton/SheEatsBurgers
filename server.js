var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var port = process.env.PORT || 3000;

/*
 * Read info about the MongoDB connection from the environment and use it to
 * form a MongoDB URL.
 */
var mongoHost = '127.0.0.1';
var mongoPort = '27017';
var mongoUser = 'sheeatsburgers';
var mongoPassword = 'sheeatsburgers';
var mongoDBName = 'sheeatsburgers';
var mongoURL = 'mongodb://localhost:27017/sheeatsburgers'
//'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

// Parse all request bodies as JSON.
app.use(bodyParser.json());

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

var userONE;

MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', mongoURL);

    // Get the documents collection
    var collection = db.collection('sheeatsburgers');
    collection.find().toArray(function (err, result) {
      userONE = result;
      console.log('first item: ', result[0]);
    });

//     //Create some users
    var user1 = {
  title: "stuff n shit",
  body: "yeah yeah yeah",
  user: "big bob",
  titleColor: "red",
  bodyColor: "green",
  footerColor: "red",
  borderColor: "yellow",
  comments: ""
};
    
    var user2 = {
  title: "tootsie rolls",
  body: "nonono",
  user: "little bob",
  titleColor: "green",
  bodyColor: "red",
  footerColor: "green",
  borderColor: "pink",
  comments: ""
};
    console.log("HERE ARE THE FIND " + userONE);
  }
});

//submit stuff
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
// assuming POST: name=foo&color=red            <-- URL encoding
//
// or       POST: {"name":"foo","color":"red"}  <-- JSON encoding

app.get('/submit', function (req, res, next) {
console.log("FUCK EYA"); 
  /*
   * If the POST body contains a photo URL, then add the new photo to the
   * person's photos in the DB and respond with success.  Otherweise, let the
   * client know they made a bad request.
   */
/////////////////////////////////////////////////////////////////////  

if (req.body && req.body.url) {
    var add_thread = {
      user: req.body.user,
      description: req.body.description
    };
    var collection = mongoDB.collection('sheeatsburgers');
    collection.updateOne(
      { user: req.params.user },
      { $push: { description: description } },
      function (err, result) {
        if (err) {
          /*
           * Send an error response if there was a problem inserting the photos
           * into the DB.
           */
          console.log("== Error inserting photo for person (", req.params.description, ") from database:", err);
          res.status(500).send("Error inserting photo itnto database: " + err);
        }
        res.status(200).send();
      });
  } //else {
 //   res.status(400).send("Person photo must have a URL.");
  //}
res.render('index-page', {
    db: userONE
  });
//////////////////////////////////////////////////////////////////////////
//window.location.href="/";
});


app.get('/', function (req, res) {

 
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


MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log("== Unable to make connection to MongoDB Database.")
    throw err;
  }
  mongoDB = db;
  app.listen(port, function () {
    console.log("== Listening on port", port);
  });
});
