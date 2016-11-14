var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = require('../models/users');
var user = new User({
	username: 'sheapy',
	name: 'furkan',
	email: 'furkansaritas@testasda21.com',
	password: 'goldroad500'
});

user.save(function (err, user) {
	if (err) console.log(err);
	console.log(user + 'saved');
	setTimeout(function () {
		user.password = 55010;
		user.increment();
		user.save(function (err, user) {
			console.log('hell yea' + user);
		});
	},3000);
});

router.get('/', function (req, res) {

	res.render('index', {
		title: 'hey its title'
	});
});


module.exports = router;