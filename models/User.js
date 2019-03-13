const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.hash(user.password, 10)
            .then((hash) => {
                user.password = hash;
                next();
            })
            .catch(err => next(err));
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw) {
    return bcrypt.compare(passw, this.password);
};


const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function (id) {
    return User.findById(id);
}

module.exports.getUserByUsername = function (username) {
    return User.findOne({
        username: username
    });
}

module.exports.addUser = function (newUser) {
    return newUser.save();
}