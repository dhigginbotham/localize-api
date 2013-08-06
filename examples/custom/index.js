var express = require('express');
var app = express();

var server = require('http').createServer(app);

var path = require('path');
var DataStore = require('nedb');
var localize = require('../../lib');

app.set('port', 1337);
app.use(express.bodyParser());
app.use(express.methodOverride());

// // simple example
// var github = new localize();

// github.mount(app);

// full example
var ds = new DataStore({
  filename: path.join(__dirname, 'db', 'fileStorage.db')
});


// define custom route endpoint
var customRoute = function (req, res) {
  res.send(req.__coderbits);
};


// define some custom middleware to display the
// functionality
var middleOne = function (req, res, next) {
  console.log('I am the middleOne middleware :)');
  next();
};

var middleTwo = function (req, res, next) {
  console.log('I am the middleTwo middleware :) :)');
  next();
};


// define specific options for your `localizer`
var opts = {
  path: 'coderbits',
  uri: 'https://coderbits.com',
  customKey: '__coderbits',
  stale: '5m',
  headers: {
    'User-Agent' : 'Testing the surf'
  },
  cache: true,
  ds: ds,
  middleware: [middleOne, middleTwo],
  customRoute: customRoute
};

var coderbits = new localize(opts);

// when mounting this route you will need to
// have access to `app`, otherwise it will have
// nowhere to mount anything.

coderbits.mount(app);

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});