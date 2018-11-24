const express = require('express');
const router = express.Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

const UserService = require('../services/user.service');
const Response = require('./response');

router.post('/login', urlencodedParser, function(req, res){
    var login = req.body.login;
    var password = req.body.password;

    UserService.login(login, password, function(err, user){
        res.status(200);
        res.end(new Response(err, user));
    });
});

router.post('/register', urlencodedParser, function(req, res){
    var login = req.body.login;
    var password = req.body.password;

    UserService.register(login, password, function(err, user){
        res.status(200);
        res.end(new Response(err, user));
    });
});

module.exports = router;