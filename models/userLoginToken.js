var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto-js');
var GLOBALS = require('../config/globals');

var Schema = mongoose.Schema;

var userLoginTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    }
}, {
        timestamps: true,
    }
);

/*
*   PreSave check if new created or password changed then hash password
*/
userLoginTokenSchema.pre('save', function (next) {
    self = this;
    self.token =crypto.AES.encrypt(self.token, GLOBALS.AESKEY).toString();
    next();
});


/*
* Compare Passwords
*/
userLoginTokenSchema.methods.resolve = function (callback) {
    self = this;
    callback(crypto.AES.decrypt(self.token,GLOBALS.AESKEY).toString(crypto.enc.Utf8));
}

/*
*   Remove token after 10mins
*/
userLoginTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 });

/*
*   Creating model from schema
*/
var userLoginToken = mongoose.model('userLoginToken', userLoginTokenSchema);

module.exports = userLoginToken;

/*
*   Clear all documents from User model
*/
module.exports.clearUserDocuments = function () {
    User.remove({}, function (err) {
        if (err) return;
        console.log('User documents are cleared!');
    });
}