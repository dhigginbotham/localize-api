### Localize API Router ###

# include modules
_ = require "underscore"
request = require "request"
extended = require "extended"

# localize
localize = (opts) ->

  # additional prefix/path identifier so
  # you can have multiple routes in place
  @path = "github"

  # we're not going to use a version by
  # default, too prone to fragmentation
  # can be toggled by switching this to
  # a string.. cheers
  @version = false

  # set github to our default localize
  # with this set, we can map our
  # external requests, this allows for
  # front-end developers to not worry about
  # CORS / configuration
  @uri = "https://api.github.com"

  # define an array of accepted methods
  # some api's should only have access
  # to certain things, clearly.
  @methods = ['post', 'put', 'delete', 'get']

  # add custom middleware to your route,
  # accepts an array of middleware
  @middleware = []

  # add a custom route handler, item will have
  # access to `req` & `res`
  @customRoute = null

  # define a custom `req` object resource
  # name to store our request body to
  @customKey = "__localized"

  ### settings to store cache items ###

  # option to set cache, defaults to `true`
  @cache = false

  # define our db as null, we'll obviously need one
  # this should be compatible with `nedb` and `mongodb`
  # out of the box `<3 nedb!!!`
  @store = null

  # define default cache length, defaults to 10 hours --
  # this uses the [`ms`](https://npmjs.org/package/ms) module, so you have a small set of stale loving
  @stale = "10h"

  # define our default cache type, accepts `nedb` and `mongodb`
  @cacheType = "nedb"

  # only extend this class if options is
  # included.
  if opts? then _.extend @, opts

  # maintain our scope... es mui importante
  self = @

  if (@cache == true) and @store?
    self.db = new extended self.db

  @request = (req, res, next) ->

    # sanitize our url so we can pass anything through
    clean = req.url.replace "/#{self.path}/", ""

    # define our route, we want this...
    url = "#{self.uri}/#{clean}"

    # lowercase our `req.method` so we don't have to
    # keep up with that.
    method = req.method.toLowerCase()

    # validate supported form methods
    if self.methods.indexOf(method) > -1

      # build `request` opts object, should probably make
      # a bit of this accessible on the front-end
      opts = 
        uri: url
        method: req.method
        headers: "User-Agent": "#{self.path}-surfing"

      # do a request with our url map, this
      # should work for our uses
      request opts, (err, resp, body) ->
        return if err? then next err, null

        # set `req[self.customKey]` to our body
        req[self.customKey] = body
        next()
    else
      next JSON.stringify {error: "Unsupported method tried, please try again."}, null

  # default router, this should send your json response back to you!!
  @router = (req, res) ->
    res.send req[self.customKey]

  @

localize::mount = (app) ->
  # mount our routes to express, this will allow for a sync
  # request, and fire only once.
  self = @

  # verify we have custom middleware, otherwise skip this loop 
  # all together
  if self.middleware.length > 0

    # loop through our middleware and add it accordingly
    for m in self.middleware
      app.all "/#{self.path}*", m

  # check for a custom route, otherwise have fun!
  if self.customRoute == null
    app.all "/#{self.path}*", self.request, self.router
  else app.all "/#{self.path}*", self.request, self.customRoute

  @

module.exports = localize
