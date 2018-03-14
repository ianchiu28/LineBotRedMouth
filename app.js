var express = require('express');
/*--var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');--*/
var linebot = require('linebot');

/*--var index = require('./routes/index');
var users = require('./routes/users');--*/
//--var webhook = require('./routes/webhook');

var bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', function(event) {
  console.log(event);

  if (event.message.type == 'text') {

    // get channel id
    var channelId;
    if (typeof event.source.groupId !== 'undefined') {
      channelId = event.source.groupId;
    } else {
      channelId = event.source.userId;
    }

    // get message
    var msg = event.message.text;
    var reply = '';

    // search from database
    var sql = "select reply from learningReply where channelId = $1 and $2 like '%' || keyword || '%';";
    pool.query(sql, [channelId, msg], (err, results) => {
      if (err) {
        throw err;        
      }

      console.log(results);
    });


    /*if (msg.includes('立誠') && (msg.includes('女朋友') || msg.includes('女友'))) {
      reply = '是指這位婆婆嗎？\n https://v.qq.com/x/page/s0126ru656q.html';
    }*/

    /*event.reply(reply).then(function(data) {
      console.log(reply);
    }).catch(function(error) {
      console.log(error);
    });*/
  }
});

var app = express();
var linebotParser = bot.parser();
app.post('/webhook', linebotParser);

// database
var { Pool } = require('pg');

var pool = new Pool({
  connectionString: process.env.DATABASE_URL  
});

app.get('/db/create', (req, res) => {
  var sql = 'create table if not exists learningReply (' + 
    'id serial primary key,' + 
    'channelId varchar(100) default null,' + 
    'keyword varchar(100) default null,' +
    'reply varchar(100) default null);';
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    console.log(results);
    res.json(results);
  });
});

app.get('/db/drop', (req, res) => {
  var sql = 'drop table learningReply;';
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    console.log(results);
    res.json(results);
  });
});

app.get('/db/insert', (req, res) => {
  var sql = "insert into learningReply (channelId, keyword, reply) values ('Ud1fee6b0ec91cc378fb893d3f922eb9e', 'AAA', 'CCC');";
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    console.log(results);
    res.json(results);
  });
});

app.get('/db/select', (req, res) => {
  var sql = 'select * from learningReply;';
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    
    console.log(results);
    res.json(results);
  });
});

// view engine setup
/*--app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));--*/
/*--app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
//app.use('/webhook', webhook);

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
});--*/

var server = app.listen(process.env.PORT || 80, function() {
  var port = server.address().port;
  console.log('App now running on port', port);
});

module.exports = app;
