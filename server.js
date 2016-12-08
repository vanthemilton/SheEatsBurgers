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

/*
 * Set up Express to use express-handlebars as the view engine.  This means
 * that when you call res.render('page'), Express will look in `views/` for a
 * file named `page` (express-handlebars will recognize the .handlebars
 * extension), and it will use express-handlebars to render the content of that
 * file into HTML.
 *
 * Here, we're also setting express-handlebars to use 'main' as the default
 * layout.  This means that, if we can res.render('page'), express-handlebars
 * will take the content from `views/page.handlebars` and plug it into the
 * {{{body}}} placeholder in `views/layouts/main.handlebars`.
 */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

// Parse all request bodies as JSON.
app.use(bodyParser.json());

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

// Render the index page for the root URL path ('/').
app.get('/', function (req, res) {
  res.render('index-page', {
    pageTitle: 'Welcome!'
  });
});

/*
 * Render the people page for the URL path '/people'.
 */
app.get('/people', function (req, res) {

  /*
   * Initiate a database query for all of our people in the database.  We'll
   * respond to the requesting client from within the callback of the query.
   */
  var collection = mongoDB.collection('people');
  collection.find({}).toArray(function (err, people) {

    if (err) {

      /*
       * Send an error response if there was a problem fetching the people
       * from the DB.
       */
      console.log("== Error fetching people from database:", err);
      res.status(500).send("Error fetching people from database: " + err);

    } else {

      /*
       * If we successfully fetched the people, augment the people with
       * info about whether each one is 65 or older, and then pass the data
       * on to HAndlebars to do the rendering.
       */
      people.forEach(function (person) {
        person.is65OrOlder = person.age >= 65;
      });

      res.render('people-page', {
        pageTitle: 'Famous People',
        people: people
      });

    }

  });

});

/*
 * Use a dynamic route to render a page for each individual person.
 */
app.get('/people/:person', function (req, res, next) {

  /*
   * Initiate a query for only the person we're interested in for this page.
   * We'll respond to the requesting client from within the callback of the
   * query.
   */
   var collection = mongoDB.collection('people');
   collection.find({ userid: req.params.person }).toArray(function (err, people) {
    if (err) {

      /*
       * Send an error response if there was a problem fetching the person
       * from the DB.
       */
      console.log("== Error fetching person (", req.params.person, ") from database:", err);
      res.status(500).send("Error fetching person from database: " + err);

    } else if (people.length >= 1) {

      /*
       * If we got at least one person (should be exactly 1), then we found the
       * requested person.  Compute whether they're 65 or older and send them
       * to Handlebars for rendering.
       */
      var person = people[0];
      person.is65OrOlder = person.age >= 65;

      // Render the page, sending all the needed info to Handlebars.
      res.render('person-page', {
        pageTitle: person.name,
        person: person
      });

    } else {

      /*
       * If there wasn't info for the requested person in the DB (i.e. if we
       * didn't get any rows back from our query), then fall through to a 404.
       */
      next();

    }

  });

});

app.post('/people/:person/add-photo', function (req, res, next) {

  /*
   * If the POST body contains a photo URL, then add the new photo to the
   * person's photos in the DB and respond with success.  Otherweise, let the
   * client know they made a bad request.
   */
  if (req.body && req.body.url) {
    var photo = {
      url: req.body.url,
      caption: req.body.caption
    };
    var collection = mongoDB.collection('people');
    collection.updateOne(
      { userid: req.params.person },
      { $push: { photos: photo } },
      function (err, result) {
        if (err) {
          /*
           * Send an error response if there was a problem inserting the photos
           * into the DB.
           */
          console.log("== Error inserting photo for person (", req.params.person, ") from database:", err);
          res.status(500).send("Error inserting photo itnto database: " + err);
        }
        res.status(200).send();
      });
  } else {
    res.status(400).send("Person photo must have a URL.");
  }

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
