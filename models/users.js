var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
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
UserSchema.pre('save', function (next) {
    self = this;

    //if password NOT newly created or changed
    if (!self.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(self.password, salt, null, function (err, hash) {
            if (err) return next(err);
            self.password = hash;
            next();
        });
    });
});

/*
*   Check if email bigger then 3 and unique  
*/
UserSchema.statics.isEmailValid = function (email, callback) {
    if (!email) return callback(false);
    if (email.length < 4) return callback(false);

    self = this;
    self.find({ email: email }, function (err, user) {
        if (err) return callback(false);
        if (user.length > 0) return callback(false);
        return callback(true);
    });
};

/*
*   Check is password obey rule and passwords match
*/
UserSchema.statics.isPasswordValid = function (password, password2, callback) {
    if (!password) return callback(false);
    if (password !== password2) return callback(false);
    if (!password.match('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')) return callback(false);
    return callback(true);
}

/*
* Compare Passwords
*/
UserSchema.methods.comparePasswords = function (postPassword, callback) {
    self = this;
    bcrypt.compare(postPassword, self.password, function (err, result) {
        if (err) return callback(false);
        return callback(result);
    });
}

/*
*   Creating model from schema
*/
var User = mongoose.model('User', UserSchema);

module.exports = User;

/*
*   Clear all documents from User model
*/
module.exports.clearUserDocuments = function () {
    User.remove({}, function (err) {
        if (err) return;
        console.log('User documents are cleared!');
    });
}
