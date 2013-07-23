_ = require "underscore"

# stati is a submodule for localize-api, it will generate counts/stats and more

stati = (opts, model, app) ->

  # we're going to have to do some searching for a model
  # so we'll give that a quick name.
  @model = model

  # store our localize options here so we have access to them
  @localize = if opts? then _.extend @localize, opts else null

  @query = null

  _app = app
  self = @

stati::find = (query, fn) ->

  q = if query? then query else {}
  [model].find q, (err, found) ->
    return if err? then fn err, null

    if found.length > 0 then fn null, found

module.exports = stati

