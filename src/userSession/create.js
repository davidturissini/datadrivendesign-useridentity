'use strict';

const rx = require('rx');
const userSessions = require('./../persistence/userSession');
const user = require('./../persistence/users');

module.exports = function (req) {

    return rx.Observable.return(req.body)
        
        // ensure user exists
        .flatMapLatest((params) => {

            return rx.Observable.create(function (o) {
                if (!user.get(params.email)) {
                    throw new Error('User does not exist');
                }

                o.onNext(params);
            });

        })

        // create user session
        .flatMapLatest((userSession) => {
            return rx.Observable.create(function (o) {
                const userSession = userSessions.create();

                o.onNext(userSession);
            });
        })

        .map((userSession) => {
            return JSON.stringify(userSession);
        })
}