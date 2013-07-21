(function() {
  var extended, ms, _;

  _ = require("underscore");

  ms = require("ms");

  extended = function(ds) {
    var int, self, _interval;
    this.garbageCollection = function(fn) {
      return ds.remove({
        stale: {
          $lt: Date.now()
        }
      }, {
        multi: true
      }, function(err, count) {
        if (err != null) {
          return fn(err, null);
        }
        return fn(null, count);
      });
    };
    _.extend(this, ds);
    self = this;
    _interval = "25m";
    int = ms(_interval);
    ds.loadDatabase(function(err) {
      if (err != null) {
        return err;
      }
      self.garbageCollection(function(err, removed) {
        if (typeof err === "function" ? err(err) : void 0) {
          return;
        }
        if (removed > 0) {
          return console.log("NeDB: sent " + removed + " items to garbarge collection");
        }
      });
      return setInterval(function() {
        return self.garbageCollection(function(err, removed) {
          if (typeof err === "function" ? err(err) : void 0) {
            return;
          }
          if (removed > 0) {
            return console.log("NeDB: sent " + removed + " items to garbarge collection");
          }
        });
      }, int);
    });
    return this;
  };

  extended.prototype.Schema = function(cache, ds) {
    var self, stale, _stale;
    stale = "5s";
    this.stale = stale;
    this.store = undefined;
    if (cache != null) {
      _.extend(this, cache);
    }
    if (this._stale != null) {
      this.stale = this._stale;
      this._stale = undefined;
    }
    _stale = ms(this.stale);
    this.stale = _stale;
    self = this;
    if ((this.stale != null) || this.stale !== false) {
      setTimeout(function() {
        return ds.garbageCollection(function(err, count) {
          if (err != null) {
            return err;
          } else if (count > 0) {
            return console.log("removed " + count + " items from cache");
          }
        });
      }, self.stale);
      this.stale = Date.now() + parseInt(self.stale);
    } else {
      this.stale = undefined;
    }
    return this;
  };

  module.exports = extended;

}).call(this);
