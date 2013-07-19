request = require "request"
extended = require "./extended"
_ = require "underscore"

requestsHandler = (req, opts, fn) ->

  # immediately extend our `this` with `opts`
  _.extend @, opts

  console.log @

  @output = null

  # maintain scope, it's important
  self = @

  # sanitize our url so we can pass anything through
  clean = req.url.replace "/#{self.path}/", ""

  # define our route, we want this...
  url = "#{self.uri}/#{clean}"

  # lets check for some cache stuff, we don't want to do this until we absolutely have to
  if (@cache == true) and @ds?
    self.ds = new extended self.ds

    # build our default search query
    query = 
      path: req.url

    self.ds.findOne query, (err, found) ->
      return if err? then fn err, null
      return if found? then fn null, found

      if not found?

        # build `request` opts object, should probably make
        # a bit of this accessible on the front-end
        options = 
          uri: url
          method: req.method
          headers: "User-Agent": "#{self.path}-surfing"

        request options, (err, resp, body) ->
          return if err? then fn err, null

          if body? 
            
            cache =
              path: req.url
              cache: JSON.parse body

            insert = new self.ds.Schema cache, self.ds

            self.ds.insert insert, (err, inserted) ->
              return if err? then fn err, null
              if inserted? then fn null, inserted
          
          else
            return fn "no body mate", null
  else

    options = 
      uri: url
      method: req.method
      headers: "User-Agent": "#{self.path}-surfing"

    request options, (err, resp, body) ->
      return if err? then fn err, null
      return if body? then fn null, body

module.exports = requestsHandler