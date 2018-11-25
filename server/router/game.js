const express = require('express');
const router = express.Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

const Response = require('./response');
const GameController = require('../controllers/game.controller');
const UserService = require('../services/user.service');

router.use(urlencodedParser, function(req, res, next){
    var token = req.body.token;

    UserService.checkToken(token, function(err, user){
        if (err === null){
            res.locals.user = user;

            next();
        } else {
            var response = new Response(err, null);

            res.status(200);
            res.end(response.stringify());
        }
    });
});

router.post('/create', urlencodedParser, function(req, res){
    var name = req.body.name;
    var theme_id = req.body.theme_id;
    var max_round = req.body.max_round;

    GameController.createGame(name, theme_id, max_round, function(err, game){
        var response = new Response(err, game);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/all', function(req, res){
    var token = req.body.token;

    GameController.getAvailableGames(function(err, games){
        var response = new Response(err, games);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/join', urlencodedParser, function(req, res){
    var game_id = req.body.game_id;

    GameController.joinGame(res.locals.user, game_id, function(err, game){
        var response = new Response(err, game);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/leave', urlencodedParser, function(req, res){
    var game_id = req.body.game_id;

    GameController.leaveGame(res.locals.user, game_id, function(err, game){
        var response = new Response(err, game);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/points', urlencodedParser, function(req, res){
    var game_id = req.body.game_id;

    GameController.getUserPoints(res.locals.user, game_id, function(err, points){
        var response = new Response(err, points);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/get', function(req, res){
    GameController.getUserGame(res.locals.user, function(err, game){
        var response = new Response(err, game);

        res.status(200);
        res.end(response.stringify());
    });
});

router.post('/getPlayers', urlencodedParser, function(req, res){
    var game_id = req.body.game_id;

    GameController.getPlayers(game_id, res.locals.user, function(err, players){
        var response = new Response(err, players);

        res.status(200);
        res.end(response.stringify());
    });
});

module.exports = router;