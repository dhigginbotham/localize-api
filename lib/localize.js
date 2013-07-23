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
    this.customRoute = null;
    this.customKey = null;
    this.locals = false;
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

  localize.prototype.mount = function(app) {
    var middlewares, self, _i, _len, _ref;
    self = this;
    if (self.middleware.length > 0) {
      _ref = self.middleware;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        middlewares = _ref[_i];
        app.all("/" + self.path + "*", middlewares);
      }
    }
    if (self.customRoute === null) {
      app.all("/" + self.path + "*", self.request, self.router);
    } else if (self.customRoute === false) {
      app.all("/" + self.path + "*", self.request);
    } else {
      app.all("/" + self.path + "*", self.request, self.customRoute);
    }
    return this;
  };

  module.exports = localize;

}).call(this);
