var express = require('express');
var app = express();

var server = require('http').createServer(app);

var path = require('path');
var DataStore = require('nedb');
var localize = require('localize-api');

app.set('port', 1337);
app.use(express.bodyParser());
app.use(express.methodOverride());

// simple example
var github = new localize();

github.mount(app);

// full example
var ds = new DataStore({
  filename: path.join(__dirname, 'db', 'fileStorage.db')
});

var customRoute = function (req, res) {
  res.send(req.__coderbits);
};

var middleOne = function (req, res, next) {
  console.log('I am the middleOne middleware :)');
  next();
};

var middleTwo = function (req, res, next) {
  console.log('I am the middleTwo middleware :) :)');
  next();
};

var opts = {
  path: 'coderbits',
  uri: 'https://coderbits.com',
  customKey: '__coderbits',
  stale: '5m',
  cache: true,
  ds: ds,
  middleware: [middleOne, middleTwo],
  customRoute: customRoute
};

var coderbits = new localize(opts);

coderbits.mount(app);

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});