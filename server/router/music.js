const express = require('express');
const router = express.Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

const Response = require('./response');
const UserService = require('../services/user.service');
const MusicController = require('../controllers/music.controller');

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

router.post('/get', urlencodedParser, function(req, res){
    var music_id = req.body.music_id;

    MusicController.getMusicByID(music_id, function(err, music){
        var response = new Response(err, music);

        res.status(200);
        res.end(response.stringify());
    });
});

module.exports = router;