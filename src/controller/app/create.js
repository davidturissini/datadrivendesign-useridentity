'use strict';

const rx = require('rx');
const bcrypt = require('bcrypt');

// Model
const App = require('./../../model/App');

// Streams
const userSessionFromRequest = require('./../../stream/userSession/fromRequest');
const userFromRequest = require('./../../stream/user/fromRequest');

module.exports = function (req) {
    const params = req.body;

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

                    return user;

                })

        })
        .flatMapLatest((user) => {
            params.user = user;


            return rx.Observable.create(function (o) {
                bcrypt.genSalt(function (err, salt) {
                    if (err) {
                        o.onError(err.message);
                    }

                    params.key = salt;

                    o.onNext(params);
                    o.onCompleted();
                });
            });


        })

        .flatMapLatest((params) => {
            return rx.Observable.create(function (o) {
                App.create(params, function (err, app) {
                    if (err) {
                        throw new Error(err);
                    }

                    o.onNext(app);
                    o.onCompleted();

                })
            });
        })

        .map((app) => {
            return app;
        })

};