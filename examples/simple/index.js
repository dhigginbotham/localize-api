var express = require('express');
var app = express();
var server = require('http').createServer(app);

// include localize-api module
var localize = require('../../lib');

app.set('port', 1337);
app.use(express.bodyParser());

// init localize
var github = new localize();

// mount paths
github.mount(app);

app.get('/', function(req, res) {
  res.redirect('/github/users/dhigginbotham');
});

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});