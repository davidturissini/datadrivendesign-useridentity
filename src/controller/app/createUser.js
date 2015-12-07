'use strict';

const rx = require('rx');
const User = require('./../../model/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const appFromRequestStream = require('./../../stream/app/fromRequest');

const validatedUserSessionFromRequest = require('./../../stream/userSession/validatedUserSessionFromRequest');

module.exports = function (req) {
    const appStream = appFromRequestStream(req);
    const params = req.body;

    return appStream.flatMapLatest((app) => {
        // Check that username is in the params
        return rx.Observable.create(function (o) {
            if (!params.username) {
                o.onError('No username specified');
            }

            o.onNext(params);
            o.onCompleted();

        })

        .flatMapLatest(function (params) {
            // Check for dupes
            return rx.Observable.create(function (o) {

                User.findOne({
                    app: app._id,
                    username: params.username
                }, function (err, user) {
                    if (err) {
                        o.onError(err.message);
                    }

                    if (user) {
                        o.onError('Username already exists');
                    }

                    o.onNext(params);
                    o.onCompleted();

                });
                
            })
        })

        // Check to make sure confirm and password match
        .flatMapLatest((params) => {
            return rx.Observable.create(function (o) {
                if (params.confirm !== params.password) {
                    o.onError('Confirm did not match password');
                }

                o.onNext(params);
                o.onCompleted();
            });
        })

        // generate salt for the user
        .flatMapLatest((params) => {

            const SALT_WORK_FACTOR = 10;

            return rx.Observable.create(function (o) {
                bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                    if (err) {
                        o.onError(err.message);
                    }

                    params.salt = salt;

                    o.onNext(params);
                    o.onCompleted();

                });

            });

        })

        // encrypt password
        .flatMapLatest((params) => {
            const salt = params.salt;
            const unHashedPassword = params.password;

            return rx.Observable.create(function (o) {
                bcrypt.hash(unHashedPassword, salt, function(err, hashedPassword) {
                    if (err) {
                        o.onError(err.message);
                    }

                    // override the cleartext password with the hashed one
                    params.password = hashedPassword;
                    o.onNext(params);
                    o.onCompleted();
                });
            });

        })

        // Save user
        .flatMapLatest((params) => {
            return rx.Observable.create(function (o) {
                params.app = app;

                User.create(params, function (err, user) {
                    if (err) {
                        o.onError(err.message);
                    }

                    o.onNext(user);
                    o.onCompleted();
                });
            });
        })
        .map((user) => {
            const json = user.toJSON();
            return _.omit(json, 'password', 'salt', '__v', 'app');
        });
    });

}