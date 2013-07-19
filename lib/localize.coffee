### Localize API Router ###

# include modules
_ = require "underscore"
request = require "request"

# localizer
localizer = (opts) ->

  # additional prefix/slug identifier so
  # you can have multiple routes in place
  @slug = "github"

  # we're not going to use a version by
  # default, too prone to fragmentation
  # can be toggled by switching this to
  # a string.. cheers
  @version = false

  # set github to our default localizer
  # with this set, we can map our
  # external requests, this allows for
  # front-end developers to not worry about
  # CORS / configuration
  @uri = "https://api.github.com"

  # define an array of accepted methods
  # some api's should only have access
  # to certain things, clearly.
  @methods = ['post', 'put', 'delete', 'get']

  # only extend this class if options is
  # included.
  if opts? then _.extend @, opts

  # maintain our scope... es mui importante
  self = @

  @middleware = (req, res, next) ->

    # sanitize our url so we can pass anything through
    clean = req.url.replace("/#{self.slug}/", "")

    # define our route, we want this...
    url = "#{self.uri}/#{clean}"
    method = req.method.toLowerCase()

    # validate supported form methods
    if self.methods.indexOf(method) > -1

      opts = 
        uri: url
        method: req.method
        headers: "User-Agent": "#{self.slug}-surfing"

      # do a request with our url map, this
      # should work for our uses
      request opts, (err, resp, body) ->
        return if err? then next err, null

        # set `req.__localized` to our body
        req.__localized = body
        next()
    else
      next JSON.stringify {error: "unsupported method tried, please try again."}, null

  @router = (req, res) ->
    res.send req.__localized

  @

localizer::mount = (app) ->
  # mount our routes to express, this will allow for a sync
  # request, and fire only once.
  self = @

  app.all "/#{self.slug}*", self.middleware, self.router  

  @

module.exports = localizer
