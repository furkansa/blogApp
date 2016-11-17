var crypto = require('crypto-js');
var GLOBALS = require('../config/globals');
var userLoginToken = require('../models/userLoginToken');
var User = require('../models/users');
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (!req.cookies.Auth) return next();
    jwt.verify(crypto.AES.decrypt(req.cookies.Auth, GLOBALS.AESKEY).toString(crypto.enc.Utf8), GLOBALS.HS256KEY, { algorithm: 'HS256' }, function (err, decodedToken) {
        if (err) return next();
        User.findById(decodedToken.id, function (err, user) {
            if (err) return next();
            req.user = user;
            return next();
        });
    });
}