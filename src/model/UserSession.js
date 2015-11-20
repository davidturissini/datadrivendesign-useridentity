'use strict';

const mongoose = require('mongoose');

const UserSession = mongoose.model('UserSession', {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true
    }
});

module.exports = UserSession;