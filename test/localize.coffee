request = require "request"
expect = require "expect.js"
_ = require "underscore"
express = require "express"

localize = require "..", "src", "localize.coffee"

path = require "path"

# store this to pass around our scope
githubTest = null

port = 3009
url = "http://localhost"

full_url = "#{url}:#{port}"

# Tests require `npm install mocha -g`, run with `npm test`

describe "build an inspect a localize object", ->
  
  it "should make a new localizer, with our defined options", (done) ->

    # okay, lets get this thing started, first we need to make a new localizer.

    testMiddleware = (req, res, next) ->
      console.log "testMiddleware is working"
      next()

    options = 
      path: "test-github"
      version: false
      uri: "https://api.github.com"
      methods: ['get']
      middleware: [testMiddleware]
      customKey: "github"
      locals: true
      cache: false

    # initialize our localize with options
    githubTest = new localize options
    
    # go onto next test
    done()

  it "should be built now, lets verify our object", (done) ->

    # verifying that our data is passing through correctly,
    # in theory it always should, but it could eff up.

    expect(githubTest).not.to.be(null)
    expect(githubTest.path).to.be("test-github")
    expect(githubTest.version).to.be(false)
    expect(githubTest.uri).to.be("https://api.github.com")
    expect(githubTest.methods[0]).to.be('get')
    expect(githubTest.methods.length).to.be(1)
    expect(githubTest.middleware).not.to.be(null)
    expect(githubTest.middleware.length).to.be(1)
    expect(githubTest.customRoute).to.be(null)
    expect(githubTest.customKey).to.be('github')
    expect(githubTest.locals).to.be(true)
    expect(githubTest.cache).to.be(false)
    
    # @todo: use these w/ cache, once you've gotten passed all the
    # request tests

    # expect(githubTest.ds).to.be()
    # expect(githubTest.stale).to.be()
    # expect(githubTest.cacheType).to.be()
    # expect(githubTest.request).to.be()
    # expect(githubTest.router).to.be()

    # finish line!
    done()

describe "test an internal API resource", ->

  it "should test a local development server and do some github surfing..", (done) ->
    app = express()

    server = require('http').createServer app

    app.set "port", port
    app.use express.bodyParser()
    app.use express.methodOverride()

    githubTest.mount app

    server.listen app.get("port"), ->
      console.log "listening on port #{app.get('port')}"

    done()

  it "should be built at this point..", (done) ->

    request "#{full_url}/test-github/users/dhigginbotham", (err, resp, body) ->
      if not err? and resp.statusCode == 200
        
        expect(body).not.to.be(null)
        
        done()

