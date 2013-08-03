/*

  build out localize api tests w/ mocha, expect.js, request, nedb, and github's API

 */

var _ = require('underscore');
var request = require('request');
var expect = require('expect.js');

var path = require('path');

// get express app going
var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.set('port', process.env.port || 1339);
app.use(express.bodyParser());

// include localize module
var localize = require('../lib');

// require nedb so we can test caching, huzzah!
var DataStore = require('nedb');

// define test variables
/////////////////////////

var TEST_HOST = "http://127.0.0.1"
var TEST_PORT = app.get('port');

var TEST_URL = TEST_HOST + ':' + TEST_PORT;

var TEST_MIDDLEWARE = function (req, res, next) {

  req.__testMiddleware = "this worked..";
  
  next();

};

var TEST_DATASTORE = new DataStore({filename: path.join(__dirname, 'db', 'testingDb.db')});

var TEST_LOCALIZE_OPTS = {
  path: 'github',
  version: false,
  uri: 'https://api.github.com',
  methods: ['get'],
  middleware: [TEST_MIDDLEWARE],
  customKey: 'github',
  locals: true,
  cache: true,
  ds: TEST_DATASTORE,
  stale: '2m'
};

// init a new localize instance
var github = new localize(TEST_LOCALIZE_OPTS);

var BASE_TEST_PATH = TEST_URL + '/' + github.path;
console.log(BASE_TEST_PATH);

// mount routes to express app
github.mount(app);

server.listen(app.get('port'), function() {
  console.log('localize-api test server loaded.');
});

describe('localize-api test framework initializing', function () {

  it('should have a github object full of our options, lets verify', function (done) {

    expect(github).not.to.be(null);
    expect(github.path).to.be("github");
    expect(github.version).to.be(false);
    expect(github.uri).to.be("https://api.github.com");
    expect(github.methods[0]).to.be('get');
    expect(github.methods.length).to.be(1);
    expect(github.middleware).not.to.be(null);
    expect(github.middleware.length).to.be(1);
    expect(github.customRoute).to.be(null);
    expect(github.customKey).to.be('github');
    expect(github.locals).to.be(true);
    expect(github.cache).to.be(true);

    done();

  });

});

describe('test some github api routes and verify we get data', function () {

  it('should give us a body full of json', function (done) {

    request.get(BASE_TEST_PATH + '/users/dhigginbotham', function (err, resp, body) {
      
      expect(err).to.be(null);
      
      expect(body).not.to.be(undefined);

      var json = JSON.parse(body);

      expect(json.login).to.equal('dhigginbotham');

      expect(json.id).to.equal(1228507);

      expect(json.path).to.equal('/github/users/dhigginbotham');
      
      expect(json.hasOwnProperty('_id')).to.be(true);

      done();

    });

  });

});
