'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var config = require('./config');

var port = process.env.PORT || config.app.port;

// view engine
app.set('view engine', 'jade');

// ressources
app.use('/bower_components', express.static('bower_components'));
app.use('/src', express.static('src'));

// root
app.get('/', function (_, res) {
  res.render(path.join(__dirname, 'src/index'), {bundles: config.bundles, livereload: true});
});

// test components
app.get('/test.component', function (req, res) {
  res.render(path.join(__dirname, 'test/protractor/component'), {bundles: config.bundles, livereload: true, params: req.query});
});

// render templates on the fly
app.get(/\/(.+)\.html$/, function (req, res) {
  res.render(path.join(__dirname, 'src/' + req.params[0]));
});

// Start the app
app.listen(port, function () {
  console.log('App started on: http://localhost:' + port);
});