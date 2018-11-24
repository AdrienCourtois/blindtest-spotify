const express = require('express');
const router = express.Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

const Response = require('./response');
const GameService = require('../services/game.service');

router.post('/create', urlencodedParser, function(req, res){
    var name = req.body.name;
    var theme_id = req.body.theme_id;

    GameService.createGame(name, theme_id, function(err, game){
        res.status(200);
        res.end(new Response(err, game));
    });
});

module.exports = router;