'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true
    }
});

module.exports = User;