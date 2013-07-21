### Localize API Router ###

# include modules
_ = require "underscore"
request = require "./request"

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
  # access to `req` & `res` @update - this now accepts
  # `false` allowing you to not use a route at all, but
  # to use as a middleware only.
  @customRoute = null

  # define a custom `req` object resource
  # name to store our request body to
  @customKey = "__localized"

  # toggle to use `req.` or `res.locals.` will default
  @locals = false

  ### settings to store cache items ###

  # option to set cache, defaults to `true`
  @cache = false

  # define our db as null, we'll obviously need one
  # this should be compatible with `nedb` and `mongodb`
  # out of the box `<3 nedb!!!`
  if @cache == true then @ds = null

  # define default cache length, defaults to 10 hours --
  # this uses the [`ms`](https://npmjs.org/package/ms) module, 
  # so you have a small set of stale loving
  if @cache == true then @stale = "1m"

  # define our default cache type, accepts `nedb` and `mongodb`
  if @cache == true then @cacheType = "nedb"

  # only extend this class if options is
  # included.
  if opts? then _.extend @, opts

  # maintain our scope... es mui importante
  self = @

  @request = (req, res, next) ->

    # lowercase our `req.method` so we don't have to
    # keep up with that.
    method = req.method.toLowerCase()

    # validate supported form methods
    if self.methods.indexOf(method) > -1

      # do a request with our url map, this
      # should work for our uses
      new request req, self, (err, resp) ->

        # set `req[self.customKey]` to our body
        req[self.customKey] = resp
        
        # allow to set directly onto `res.locals` this will
        # all you to direcly map this to a custom endpoint with
        # `res.render()` without any added steps
        if self.locals == true then res.locals[self.customKey] = resp

        next()
    
    else
    
      next JSON.stringify {error: "Restricted/Unsupported method, please try again."}, null

  # default router, this should send your json response back to you!!
  @router = (req, res) ->
    # set `req[self.customKey]` to our body
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
    for middlewares in self.middleware
      app.all "/#{self.path}*", middlewares

  # check for a custom route, otherwise have fun!
  if self.customRoute == null
    app.all "/#{self.path}*", self.request, self.router
  else if self.customRoute == false then app.all "/#{self.path}*", self.request
  else app.all "/#{self.path}*", self.request, self.customRoute

  @

module.exports = localize
