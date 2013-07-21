_ = require "underscore"
ms = require "ms"

# extend nedb to give us a Schema we can generate easily with a stale timestamp
# this will allow us to do a very simpe garbage collection for these `temporary`
# objects

# lets just patch this through so our Schema can have it without needing
# to include it else where

extended = (ds) ->

  @garbageCollection = (fn) ->
    ds.remove {stale: {$lt: Date.now()}}, {multi: true}, (err, count) ->
      return if err? then fn err, null
      fn null, count

  _.extend @, ds

  self = @

  _interval = "25m"

  int = ms(_interval)

  ds.loadDatabase (err) -> # dont use this, use interior option `autoload: true` for nedb
    return if err? then err
    
    # run this once, because it's okay.
    self.garbageCollection (err, removed) ->
      return if err? err
      if removed > 0
        console.log "NeDB: sent #{removed} items to garbarge collection"

    setInterval ->
      self.garbageCollection (err, removed) ->
        return if err? err
        if removed > 0
          console.log "NeDB: sent #{removed} items to garbarge collection"
    , int # setting this to ten minute increments should do the trick.

  @

# Schema takes opts, and you can really extend that to as large as you'd like
extended::Schema = (cache, ds) ->

  stale = "5s"
  
  @stale = stale

  @store = `undefined`
  
  if cache? then _.extend @, cache

  # check for override of `@stale`
  if @_stale? 
    @stale = @_stale
    # clear this out w/ `undefined` so it doesn't get
    # stored into the doc
    @_stale = `undefined`

  _stale = ms(@stale)

  @stale = _stale

  self = @
  
  if @stale? or @stale != false
    setTimeout ->
      ds.garbageCollection (err, count) ->
        return if err? then err else if count > 0 then console.log "removed #{count} items from cache"
    , self.stale

    @stale = Date.now() + parseInt self.stale

  else
    @stale = `undefined`

  @

module.exports = extended
