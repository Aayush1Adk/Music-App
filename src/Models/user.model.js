const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'artist'], // enum means there are only two possible values for role, either 'user' or 'admin'
        default: 'user'
}
});

const UserModule = mongoose.model('User', userSchema);

module.exports = UserModule;