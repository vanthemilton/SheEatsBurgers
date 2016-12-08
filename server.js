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
  borderolor: "yellow",
  comments: ""
};
    
    var user2 = {
  title: "tootsie rolls",
  body: "nonono",
  user: "little bob",
  titleColor: "green",
  bodyColor: "red",
  footerColor: "green",
  borderolor: "pink",
  comments: ""
};

    // Insert some users
    collection.insert([user1, user2], function (err, result) {
          
 //userONE = collection.find().sort({title:1}).limit(50);
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
         

      //Close connection
      //console.log("db wat" + collection.find({title:"test 1"}));
      //db.close();
    });
    console.log("HERE ARE THE FIND " + userONE);
  }
});





// Render the index page for the root URL path ('/').
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

/*
 * Make a connection to our Mongo database.  We'll use this connection
 * throughout the lifetime of our server app.  If the connection succeeded,
 * save the database to a file-scoped variable and start our server listening
 * on the specified port.
 */
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
