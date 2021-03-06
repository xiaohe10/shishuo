var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/accounts');
var lessons = require('./routes/lessons');
var questions = require('./routes/question');
var news = require('./routes/news');
var pay = require('./routes/pay');
var bill = require('./routes/bill');
var announcement = require('./routes/announcement');
var suggestion = require('./routes/suggestion');
var androidupdate = require('./routes/androidupdate');
var invitecode = require('./routes/invitecode');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/accounts', users);

app.use('/lesson',lessons);
app.use('/question',questions);
app.use('/news',news);
app.use('/pay',pay);
app.use('/bill',bill);
app.use('/announcement',announcement);
app.use('/suggestion',suggestion);
app.use('/androidupdate',androidupdate);
app.use('/invitecode',invitecode);



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
