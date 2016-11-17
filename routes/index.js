var express = require('express');
var router = express.Router();
var cookie = require('cookie-parser');

var mongoose = require('mongoose');

router.get('/', function(req, res) {
    res.render('index', {
        title: 'hey its title'
    });
});

module.exports = router;