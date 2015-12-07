'use strict';

const rx = require('rx');
const UserSession = require('./../../model/UserSession');
const User = require('./../../model/User');
const UnauthorizedError = require('./../../error/Unauthorized');
const bcrypt = require('bcrypt');

module.exports = function (app, params) {

        console.log('params', params);
    return rx.Observable.return(params)
        // ensure user exists
        .flatMapLatest((params) => {
            return rx.Observable.create(function (o) {
                User.findOne({
                    app: app,
                    username: params.username
                }, function (err, user) {
                    if (err) {
                        o.onError(err.message);
                    }

                    if (!user) {
                        o.onError('User does not exist');
                    }

                    o.onNext({
                        user,
                        params
                    });

                });

            });

        })

        // validate password
        .flatMapLatest(({ user, params }) => {
            const salt = user.salt;
            const password = params.password;

            return rx.Observable.create(function (o) {
                bcrypt.hash(password, salt, function(err, hashedPassword) {
                    if (err) {
                        o.onError(err.message);
                    }

                    if (hashedPassword !== user.password) {
                        o.onError('Invalid password');
                    }

                    o.onNext({
                        user,
                        params
                    });

                    o.onCompleted();

                });

            });
        })

        // create user session
        .flatMapLatest(({ user, params }) => {
            return rx.Observable.create(function (o) {
                UserSession.create({
                    app: app,
                    user: user
                }, function (err, userSession) {
                    if (err) {
                        o.onError(err.message);
                    }

                    o.onNext(userSession);
                    o.onCompleted();
                })
                
            });
        })

        .map((userSession) => {
            const json = userSession.toJSON();

            return {
                _id: json._id,
                user_id: json.user._id
            };
        });
}