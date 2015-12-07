'use strict';

const rx = require('rx');

// Model
const User = require('./../../model/User');

// Streams
const validatedUserSessionFromRequest = require('./../../stream/userSession/validatedUserSessionFromRequest');
const appStreamFromRequest = require('./../../stream/app/fromRequest');


module.exports = function (req) {

    // Get user session
    return validatedUserSessionFromRequest(req)
        .flatMapLatest((data) => {
            return appStreamFromRequest(req);
        })

        .flatMapLatest((app) => {

            return rx.Observable.create(function (o) {
                User.find({
                    app: app
                }, function (err, users) {
                    if (err) {
                        o.onError(err);
                    }

                    o.onNext(users);
                    o.onCompleted();

                });

            });

        });

}