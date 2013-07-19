## localize-api
I needed a way to have more control over external API's as well as keep the REST API functionality. This module allows you to localize external API's along with a simple cache layer/garbarge collection utilizing [`nedb`](https://github.com/louischatriot/nedb), I plan to build in [`mongodb`](https://github.com/mongodb/node-mongodb-native) as well. 

### Features
- express api mount/router for external resources
- 100% coffeescript, hate it or love it
- negates the whole clientside `cors` issue for some people by using request, and localizes to a RESTful route

### Installation
```md
npm install git+https://github.com/dhigginbotham/localize-api --save
```

You'll also need CoffeeScript, it's easy though: `npm install coffeescript -g`

## Full Example w/ Express, and options
This example depends on having [`express.js`](https://github.com/visionmedia/express) and [`nedb`](https://github.com/louischatriot/nedb) available:

  `npm install express nedb --save`

```js
var express = require('express');
var app = express();

var server = require("http").createServer(app);

var path = require('path');
var DataStore = require('nedb');
var localize = require('localize-api');

app.set('port', 1337);
app.use(express.bodyParser());
app.use(express.methodOverride());

// simple example
var github = new localize();

github.mount(app);

// full example
var ds = new DataStore({
  filename: path.join(__dirname, 'db', 'fileStorage.db');
});

var customRoute = function (req, res) {
  res.send(req.__coderbits);
};

var middleOne = function (req, res, next) {
  console.log("I am the middleOne middleware :)");
  next();
};

var middleTwo = function (req, res, next) {
  console.log("I am the middleTwo middleware :) :)");
  next();
};

var opts = {
  path: 'coderbits',
  uri: 'https://coderbits.com',
  customKey: '__coderbits',
  stale: '5m',
  cache: true,
  ds: ds,
  middleware: [middleOne, middleTwo],
  customRoute: customRoute
};

var coderbits = new localize(opts);

coderbits.mount(app);

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});

// GET http://localhost:1337/coderbits/dhz.json
```

### Options
Name | Defaults | Info
--- | --- | ---
`accepted` | `['post', 'put', 'delete', 'get']` | accepted methods to run external requests against, expects an array
`cache` | `false` | uses [`nedb`](https://github.com/louischatriot/nedb) currently, still finishing `mongodb`
`customKey` | `__localized` | override the default `req` object addition
`customRoute` | `null` | allows you to pass a custom route through as your endpoint, helpful if you want to use the output to template a file
`ds` | `DataStore` | you'll get one of these from [`nedb`](https://github.com/louischatriot/nedb)
`middleware` | `[]` | allows you to add custom middleware to your api, good for authentication/ensureLogin etc
`path` | `github` | defaults to `github` which is the default api to get this going quickly
`stale` | `1m` | uses `ms` module for ez times eg: `1s, 1m, 5m, 1h, 10h, 1d, etc`
`uri` | `https://api.github.com` | api path to localize


### License
```md
The MIT License (MIT)

Copyright (c) 2013 David Higginbotham 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
