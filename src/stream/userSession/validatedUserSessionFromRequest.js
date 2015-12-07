'use strict';

const rx = require('rx');

// Model
const App = require('./../../model/App');

// Streams
const userSessionFromRequest = require('./../../stream/userSession/fromRequest');
const userFromRequest = require('./../../stream/user/fromRequest');

module.exports = function (req) {

    // Get user session
    return userSessionFromRequest(req)
        .flatMapLatest((userSession) => {
            if (!userSession) {
                throw new Error('Invalid user session');
            }

            return userFromRequest(req)
                .map((user) => {

                    if (!user) {
                        throw new Error('Invalid user');
                    }

                    if (user._id.toString() !== userSession.user.toString()) {
                        throw new Error('Invalid user session');
                    }

                    return {
                        user: user,
                        userSession: userSession
                    };

                })

        });

}