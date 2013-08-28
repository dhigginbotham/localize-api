(function() {
  var extended, request, requestsHandler, _;

  request = require("request");

  extended = require("./extended");

  _ = require("underscore");

  requestsHandler = function(req, opts, fn) {
    var clean, options, query, self, url;
    _.extend(this, opts);
    this.output = null;
    self = this;
    clean = req.path.replace("/" + self.path + "/", "");
    url = self.uri + clean;
    options = {
      url: url,
      method: self.methodOverride != null ? self.methodOverride : req.method,
      qs: req.query != null ? req.query : {},
      form: self.bodyOverride != null ? _.extend(req.body, self.bodyOverride) : req.body,
      headers: Object.keys(self.headers).length > 0 ? self.headers : {},
      strictSSL: self.strictSSL
    };
    if ((this.cache === true) && (this.ds != null)) {
      self.ds = new extended(self.ds);
      query = {
        path: req.url
      };
      return self.ds.findOne(query, function(err, found) {
        if (err != null) {
          return fn(err, null);
        }
        if (found != null) {
          return fn(null, found);
        }
        if (found == null) {
          return request(options, function(err, resp, body) {
            var cache, insert;
            if (err != null) {
              return fn(err, null);
            }
            if (resp.statusCode > 305) {
              return fn(JSON.stringify(_.extend({}, body, {
                error: "Error occured, unhandled status code: " + resp.statusCode
              })), null);
            }
            if (body != null) {
              cache = JSON.parse(body);
              cache.stale = self.stale;
              cache.path = req.url;
              insert = new self.ds.Schema(cache, self.ds);
              return self.ds.insert(insert, function(err, inserted) {
                if (err != null) {
                  return fn(err, null);
                }
                if (inserted != null) {
                  return fn(null, inserted);
                }
              });
            } else {
              return fn("something bad happened, id look into this...", null);
            }
          });
        }
      });
    } else {
      return request(options, function(err, resp, body) {
        if (err != null) {
          return fn(err, null);
        }
        if (resp.statusCode > 305) {
          return fn(JSON.stringify(_.extend({}, body, {
            error: "Error occured, unhandled status code: " + resp.statusCode
          })), null);
        }
        if (body != null) {
          return fn(null, body);
        }
      });
    }
  };

  module.exports = requestsHandler;

}).call(this);
