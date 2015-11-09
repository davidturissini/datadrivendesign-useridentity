'use strict';

const rx = require('rx');
const userSessions = require('./../persistence/userSession');
const users = require('./../persistence/users');
const UnauthorizedError = require('./../error/Unauthorized');

module.exports = function (req) {

    return rx.Observable.return(req.body)
        
        // ensure user exists
        .flatMapLatest((params) => {

            return rx.Observable.create(function (o) {
                const user = users.findByEmail(params.email);

                
                if (!user) {
                    throw new UnauthorizedError('User does not exist');
                }

                o.onNext({ user, params });
            });

        })

        // validate password
        .flatMapLatest(({ user, params }) => {
            
            return rx.Observable.create(function (o) {
                if (user.password !== params.password) {
                    throw new UnauthorizedError('Invalid password');
                }

                o.onNext({ user, params });

            });
        })

        // create user session
        .flatMapLatest(({ user, params }) => {
            return rx.Observable.create(function (o) {
                const userSession = userSessions.create(user);

                o.onNext(userSession);
            });
        })

        .map((userSession) => {
            return JSON.stringify(userSession);
        })
}