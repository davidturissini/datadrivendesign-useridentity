'use strict';

const rx = require('rx');
const mongoose = require('mongoose');

// Query
const userQueryById = require('./../../query/user/queryById');

// Model
const UserSession = require('./../../model/UserSession');

module.exports = function (userId, userSessionId) {
    function rejectUserSession(o) {
        o.onError({
            message: 'Invalid token'
        });
    }

    return userQueryById(userId)
        .flatMapLatest((user) => {

            return rx.Observable.create(function (o) {

                if (!mongoose.Types.ObjectId.isValid(userSessionId)) {
                    rejectUserSession(o);
                }

                o.onNext({
                    user: user,
                    userSessionId: userSessionId
                });

                o.onCompleted();
            
            });

        })
        .flatMapLatest((data) => {
            const user = data.user;
            const userSessionId = data.userSessionId;
            
            return rx.Observable.create(function (o) {

                UserSession.findOne({
                    user: user,
                    _id: userSessionId
                }, function (err, userSession) {
                    if (err) {
                        o.onError(err);
                    }

                    if (userSession === null) {
                        rejectUserSession(o);
                    }

                    o.onNext({
                        valid: true
                    });

                    o.onCompleted();
                })
            });
        });
}