var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
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

UserSchema.pre('save', function(next){
    console.log('presave function' + this.password);
    next();
});


//it deletes after 120 seconds!
//UserSchema.index({createdAt: 1},{expireAfterSeconds: 120});
module.exports = mongoose.model('User', UserSchema);