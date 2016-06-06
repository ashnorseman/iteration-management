var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connection;

// Webpack
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack-dev-config');
var compiler = webpack(config);

var routes = require('./routes/index');
var users = require('./routes/users');
var iterations = require('./routes/iterations');

var app = express();

// database setup
mongoose.connect('mongodb://ash:sherry@121.40.197.93:27017/iteration');
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', console.log.bind(console, 'connection connected'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(webpackDevMiddleware(compiler, {
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use('/', routes);
app.use('/users', users);
app.use('/iterations', iterations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
