var linebot = require('linebot');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var bot = linebot({
  channelId: 1567360579,
  channelSecret: '4c4c3f42667878edac146cb810f4c939',
  channelAccessToken: 'foiJFyfZY1i2N3W4vKaxZamM5wZF1BHyyWRBf5z/PAzpRU+gk4R1FXR1gJCQFOTFx1mUqymJBbfDNKe3u7Ai5AH/QK0/97Y9k3Cwa6cgevjYy7YXP0zpfjEhDtGUWKp8GCHGdOaB5tWOuDj2tUPpkgdB04t89/1O/w1cDnyilFU='
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

bot.on('message', function(event){
  console.log(event);
});

var linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log('App now running on port', port);
});

module.exports = app;
