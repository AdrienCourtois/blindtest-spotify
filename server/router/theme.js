const express = require('express');
const router = express.Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: true });

const ThemeService = require('../services/theme.service');
const UserService = require('../services/user.service');
const Response = require('./response');

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

router.post('/all', function(req, res){
    ThemeService.getAllThemes(function(err, themes){
        var response = new Response(err, themes);

        res.status(200);
        res.end(response.stringify());
    });
});

module.exports = router;