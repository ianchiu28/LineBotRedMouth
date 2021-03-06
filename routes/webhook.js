var express = require('express');
var router = express.Router();
var pool = require('../lib/database').pool;

// line bot
var linebot = require('linebot');
var bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', (event) => {
    console.log('event:\n', event);

    if (event.message.type == 'text') {
        var channelId = GetChannelId(event);
        var message = event.message.text;

        if (IsLearningString(message)) {
            RedMouthLearning(event, channelId, message);
        } else {
            RedMouthReply(event, channelId, message);
        }
    }
});

var linebotParser = bot.parser();

router.post('/', linebotParser);

function GetChannelId(event) {
    if (typeof event.source.groupId !== 'undefined') {
        return event.source.groupId;
    } else {
        return event.source.userId;
    }
}

function IsLearningString(string) {
    if (string.substring(0, 5) == '紅嘴學說話' || string.substring(0, 5) == '嘴嘴學說話') {
        return true;
    } else return false;
}

function RedMouthLearning(event, channelId, message) {
    message = message.split(';');
    var learnKeyword = message[1];
    var learnReply = message[2];

    var sqlLearning = "select id from learningReply where channelId = $1 and keyword = $2;";
    pool.query(sqlLearning, [channelId, learnKeyword], (err, results) => {
        if (err) {
            throw err;
        }

        var param = [];
        if (results.rows.length == 0) {
            // insert
            sqlLearning = "insert into learningReply (channelId, keyword, reply) values ($1, $2, $3);";
            param = [channelId, learnKeyword, learnReply];
        } else {
            // update
            var id = results.rows[0].id;
            sqlLearning = "update learningReply set reply = $1 where id = $2;";
            param = [learnReply, id];
        }

        pool.query(sqlLearning, param, (err, results) => {
            if (err) {
                throw err;
            }

            ReplyToUser(event, '好唷～～～');
        });
    });
}

function RedMouthReply(event, channelId, message) {
    // search from database
    var sqlReply = "select reply from learningReply where channelId = $1 and $2 like '%' || keyword || '%';";
    pool.query(sqlReply, [channelId, message], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rowCount !== 0) {
            console.log('result:\n', results);
            var reply = results.rows[0].reply;

            ReplyToUser(event, reply);
        }
    });
}

function ReplyToUser(event, message){
    event.reply(message).then((data) => {
        console.log(message);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = router;