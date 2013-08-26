/* Localize API Router*/


(function() {
  var localize, request, _;

  _ = require("underscore");

  request = require("./request");

  localize = function(opts) {
    var self;
    this.path = "github";
    this.version = false;
    this.uri = "https://api.github.com";
    this.methods = ['post', 'put', 'delete', 'get'];
    this.middleware = [];
    this.headers = {};
    this.bodyOverride = null;
    /* 
    
    @todo - add option for custom headers because `req.headers`
    was not correctly mapping to `github` and giving errors.
    
    something like this will be coming:
    
    this.getKnownHeaders = function (req, res, fn) {
    
      var headers = _.extend req.headers, this.headers;
    
    };
    
    this.headers = {
      'User-Agent' : 'some-user-agent-idk'
    };
    */

    this.customRoute = null;
    this.customKey = null;
    this.locals = false;
    this.strictSSL = false;
    /* settings to store cache items*/

    this.cache = false;
    if (this.cache === true) {
      this.ds = null;
    }
    if (this.cache === true) {
      this.stale = "1m";
    }
    if (this.cache === true) {
      this.cacheType = "nedb";
    }
    if (opts != null) {
      _.extend(this, opts);
    }
    if (this.uri === "https://api.github.com") {
      this.headers = {
        'user-agent': 'node-localize-api-surfing'
      };
    }
    if (this.path.indexOf("/") === 0) {
      this.path = this.path.substr(1);
    }
    if (this.customKey === null) {
      this.customKey = this.path;
    }
    self = this;
    this.request = function(req, res, next) {
      var method;
      method = req.method.toLowerCase();
      if (self.methods.indexOf(method) > -1) {
        return new request(req, self, function(err, resp) {
          if (err != null) {
            return next(err, null);
          }
          req[self.customKey] = resp;
          if (self.locals === true) {
            res.locals[self.customKey] = resp;
          }
          return next();
        });
      } else {
        return next(JSON.stringify({
          error: "Restricted/Unsupported method, please try again."
        }, null));
      }
    };
    this.router = function(req, res) {
      return res.send(req[self.customKey]);
    };
    return this;
  };

  localize.prototype.mount = function(app, fn) {
    var self;
    self = this;
    if (self.middleware.length > 0) {
      app.all("/" + self.path + "*", self.middleware);
    }
    if (self.customRoute === null) {
      app.all("/" + self.path + "*", self.request, self.router);
    } else if (self.customRoute === false) {
      app.all("/" + self.path + "*", self.request, self.router);
    } else {
      app.all("/" + self.path + "*", self.request, self.customRoute);
    }
    if (typeof fn === "undefined") {
      return this;
    } else {
      return fn(this);
    }
  };

  module.exports = localize;

}).call(this);
