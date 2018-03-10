var express = require('express');
var linebot = require('linebot')
var router = express.Router();

var bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', function(event) {
  event.reply(event.message.text).then(function (data) {
    // success
    console.log('$$ Success $$', data);
  }).catch(function (error) {
    // error
    console.log('$$ Error $$', error);
  });
});

var linebotParser = bot.parser();
router.post('/', linebotParser);

module.exports = router;