'use strict';

const mongoose = require('mongoose');

const UserSession = mongoose.model('UserSession', {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        required: true
    }
});

module.exports = UserSession;