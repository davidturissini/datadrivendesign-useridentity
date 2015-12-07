'use strict';


const rx = require('rx');
const mongoose = require('mongoose');

// Action
const userValidateUserSession = require('./../../action/user/validateUserSession');

// Stream
const userFromRequestStream = require('./../../stream/user/fromRequest');



module.exports = function (req) {
    return userFromRequestStream(req)
        .flatMapLatest((user) => {
            const userSessionId = req.body.data.id;

            return userValidateUserSession(user._id, userSessionId);

        });
}