'use strict';

const rx = require('rx');

// Model
const App = require('./../../model/App');

// Streams
const validatedUserSessionFromRequest = require('./../../stream/userSession/validatedUserSessionFromRequest');
const appStreamFromRequest = require('./../../stream/app/fromRequest');

module.exports = function (req) {

    // Get user session
    return validatedUserSessionFromRequest(req)
        .flatMapLatest((data) => {
            return appStreamFromRequest(req);
        });

}