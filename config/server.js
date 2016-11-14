var mongodb = require('mongodb');
var mongoose = require('mongoose');

var GLOBALS = require('./globals');

var connect = function() {
  return mongoose.connect(GLOBALS.DBCONNECTIONSTRING, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 3 sec');
    }
  });
};
connect();


mongoose.connection.on('connected', function () {
    console.log('Mongoose connected!');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose error' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected!');
    setTimeout(function() {
       connect(); 
    }, 3000);
});

/*
* Kill connection before node app shutdown
*/
process.on('SIGINT', function () {
    console.log('Mongoose closing!');
    mongoose.connection.close(function () {
        process.exit();
    });
});

module.exports.mongoose = mongoose;
