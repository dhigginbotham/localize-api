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
    clean = req.url.replace("/" + self.path + "/", "");
    url = "" + self.uri + "/" + clean;
    if ((this.cache === true) && (this.ds != null)) {
      self.ds = new extended(self.ds);
      query = {
        path: req.url
      };
      return self.ds.findOne(query, function(err, found) {
        var options;
        if (err != null) {
          return fn(err, null);
        }
        if (found != null) {
          return fn(null, found);
        }
        if (found == null) {
          options = {
            uri: url,
            method: req.method,
            headers: Object.keys(self.headers).length > 0 ? self.headers : req.headers
          };
          return request(options, function(err, resp, body) {
            var cache, insert;
            if (err != null) {
              return fn(err, null);
            }
            if (resp.statusCode > 305) {
              return fn(JSON.stringify({
                error: "Error occured, unhandled status code: " + resp.statusCode
              }), null);
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
      options = {
        uri: url,
        method: req.method,
        headers: Object.keys(self.headers).length > 0 ? self.headers : req.headers
      };
      return request(options, function(err, resp, body) {
        if (err != null) {
          return fn(err, null);
        }
        if (resp.statusCode > 305) {
          return fn(JSON.stringify({
            error: "Error occured, unhandled status code: " + resp.statusCode
          }), null);
        }
        if (body != null) {
          return fn(null, body);
        }
      });
    }
  };

  module.exports = requestsHandler;

}).call(this);
