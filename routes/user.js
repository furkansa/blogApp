var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var GLOBALS = require('../config/globals');
var User = require('../models/users');
var userLoginToken = require('../models/userLoginToken');
var loginMiddlewere = require('../middlewere/login');
var cookie = require('cookie-parser');

router.get('/', function(req, res) {
    console.log(req.cookies.Auth);
    res.redirect('/user/create');
});

router.get('/test', loginMiddlewere, function(req, res) {
    console.log(req.user);
    if (!req.user) return console.log('no user was found');

});

/*
*   Display login user form
*/
router.get('/login', function(req, res) {
    res.clearCookie('Auth');
    res.render('loginUser', {
        title: 'Login User'
    });
});

/*
*   Login User from post
*/
router.post('/login', function(req, res) {
    self = this;
    var vals = _.pick(req.body, 'email', 'password');

    if (!vals.email) return res.render('loginUser', { title: 'Login User', error: 'Email is absend!' });
    if (!vals.password) return res.render('loginUser', { title: 'Login User', error: 'Password is absend!' });
    User.findOne({ email: vals.email }, function(err, user) {
        if (err) return res.render('loginUser', { title: 'Login User', error: 'Cant find User!' });
        if (!user) return res.render('loginUser', { title: 'Login User', error: 'No user fonud!' });
        user.comparePasswords(vals.password, function(result) {
            if (!result) return res.render('loginUser', { title: 'Login User', error: 'Password is wrong!' });
            jwt.sign({
                id: user.id
            }, GLOBALS.HS256KEY, { algorithm: 'HS256', expiresIn: 60 * 60 }, function(err, token) {
                if (err) return res.render('loginUser', { title: 'Login User', error: 'Token error!' });
                new userLoginToken({ token: token }).save(function(err, token) {
                    if (err) return res.render('loginUser', { title: 'Login User', error: 'DB error!' });

                    //pass login Auth info to cookie
                    res.cookie('Auth', token.token, { maxAge: 60 * 60 * 1000, httpOnly: true });
                    res.redirect('/');
                });
            });
        });
    });
});

/*
*   Display create user form
*/
router.get('/create', function(req, res) {
    res.render('createUser', {
        title: 'Create User',
    });
});

/*
*   Create User From post
*/
router.post('/create', function(req, res) {
    var vals = _.pick(req.body, 'email', 'password', 'password2');

    User.isEmailValid(vals.email, function(isEmailValid) {
        if (!isEmailValid) return res.redirect('createUser', { title: 'CreateUser', error: 'Email is not valid!' });
        User.isPasswordValid(vals.password, vals.password2, function(isPasswordValid) {
            if (!isPasswordValid) return res.redirect('createUser', { title: 'CreateUser', error: 'Password is not valid or not match!' });
            new User(vals).save(function(err) {
                if (err) return res.redirect('createUser', { title: 'CreateUser', error: 'DB error!' });
                return res.redirect('/user/login');
            });
        });
    });
});

router.get('/changePassword', loginMiddlewere, function(req, res) {
    if (!req.user) return res.redirect('/user/login');
    res.render('changePassword', { title: 'Change Password' });
});

router.post('/changePassword', loginMiddlewere, function(req, res) {
    if (!req.user) return res.redirect('/user/login');

    var vals = _.pick(req.body, 'oldPassword', 'newPassword', 'newPassword2');

    if (!vals.oldPassword || !vals.newPassword || !vals.newPassword2) return res.render('changePassword', { title: 'Change Password', error: 'some of input is missing' });

    req.user.comparePasswords(vals.oldPassword, function(result) {
        if (!result) return res.render('changePassword', { title: 'Change Password', error: 'Password is wrong!' });
        User.isPasswordValid(vals.newPassword, vals.newPassword2, function(result) {
            if (!result) return res.render('changePassword', { title: 'Change Password', error: 'Password not matching!' });
            req.user.password = vals.newPassword;
            req.user.save(function(err, user) {
                if (err) return res.render('changePassword', { title: 'Change Password', error: 'cant save to db' });
                res.clearCookie('Auth');
                res.redirect('user/login');
            });
        });
    });
});

module.exports = router;