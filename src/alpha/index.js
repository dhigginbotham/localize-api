var _ = require('lodash');

/*

  node api proxy require(napip);

 */

var napip = function (options) {

  // options section
  

  // path: `/{path}/{proxy-layer}`
  this.path = 'github';

  // uri: `https://api.github.com`
  // **note:** you can add the `/` trailing slash, we sanitize inputs here. 
  this.uri = 'https://api.github.com';

  // methods: `['post', 'put', 'delete', 'get']`
  this.methods = ['post', 'put', 'delete', 'get'];

  // headers: `{}`
  this.headers = {
    'User-Agent' : 'napip'
  };

  // bodyOverride: `{}`
  this.bodyOverride = {};

  // methodOverride: `null`
  // **note:** you can override the methods of your clients with this one
  this.methodOverride = null;

  this.key = null;
  this.locals = false;
  this.strictSSL = false;
  this.cache = false;

  if (typeof options != 'undefined' || options != null) {

    _.extend(this, options);

  };

  var self = this;

  // destination: `null`
  this.destination = function (req, res) {

    return res.send

  };

  return this;

};