var express = require('express');
var middleware = require('@line/bot-sdk').middleware;
var router = express.Router();

var config = {
    channelAccessToken: /*process.env.CHANNEL_SECRET*/'7931c003dd5482aa22b88e7a296b3f18',
    channelSecret: /*process.env.CHANNEL_ACCESS_TOKEN*/'zeKP9HDE7tjaxGalU5WlnXHxyosefiW1xwxZnXP+6456Uhk6Aakz9vcTFk1TqASGx1mUqymJBbfDNKe3u7Ai5AH/QK0/97Y9k3Cwa6cgevg6XGBw3oZlTrB5/0GUUtaUS8B4N4RaX//mGncFt4tJWAdB04t89/1O/w1cDnyilFU='
};

router.post('/', middleware(config), function(req, res) {
    res.json(req.body.events);
});

module.exports = router;