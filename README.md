## localize-api
Easy module to make exploring api's a breeze, don't worry about `CORS` with clientside external requests, use this -- map the root dir of the API, pass some opts and you're all set.

### Features
- express api mount/router for external resources
- 100% coffeescript, hate it or love it
- extendable w/ `nedb` & `mongodb` __not finished__
- negates the whole clientside `cors` issue for some people by using request, and localizes to a RESTful route

### Usage
```js
// somewhere in your app.js file,
// really anything with access to app

// require module
var localize = require('localize-api');

var github = new localize();

github.mount(app);

// assuming your app is running on port 1337
// curl http://localhost:1337/github/users/dhigginbotham

// add another api route

var opts = {
  path: "coderbits",
  uri: "https://coderbits.com",
  customKey: '__coderbits',
  // middleware: [someMiddlewareFunction, anotherMiddlewareFunction],
  customRoute: function (req, res) {
    res.send(req.__coderbits);
  }
};

var coderbits = new localize(opts);

coderbits.mount(app);

// assuming your app is running on port 1337
// curl http://localhost:1337/coderbits/dhz.json
```

### Options
Name | Defaults | Info
--- | --- | ---
`slug` | `github` | defaults to `github` which is the default api to get this going quickly
`uri` | `https://api.github.com` | api path to localize
`accepted` | `['post', 'put', 'delete', 'get']` | accepted methods to run external requests against, expects an array
`middleware` | `[]` | allows you to add custom middleware to your api, good for authentication/ensureLogin etc
`customRoute` | `null` | allows you to pass a custom route through as your endpoint, helpful if you want to use the output to template a file
`customKey` | `__localized` | override the default `req` object addition

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
